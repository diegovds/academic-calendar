import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getNextTasks } from '../functions/get-next-tasks'

// Schema Zod para a resposta, já refletindo curso → disciplina → tarefas
const nextTasksResponseSchema = z.array(
  z.object({
    courseId: z.uuid(),
    courseName: z.string(),
    disciplines: z.array(
      z.object({
        disciplineId: z.uuid(),
        disciplineName: z.string(),
        tasks: z.array(
          z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string(),
            dueDate: z.date(),
            type: z.enum(['exam', 'activity']),
          })
        ),
      })
    ),
  })
)

// Inferência do tipo automaticamente
type NextTasksResponse = z.infer<typeof nextTasksResponseSchema>

export const nextTasksRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/tasks/next',
    {
      schema: {
        summary: 'Get the next 6 tasks for the authenticated user',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            tasks: nextTasksResponseSchema
          }),
          404: z.object({ message: z.string().nullish() }),
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.sub

      const result = await getNextTasks({ userId })

      if (!result.tasks) {
        return reply.status(404).send({ message: 'No upcoming tasks found' })
      }

      // Agrupa as tarefas por disciplina e depois por curso
      const grouped = result.tasks.reduce<NextTasksResponse>(
        (acc, t) => {
          const courseId = t.discipline.semester.course.id
          const courseName = t.discipline.semester.course.title
          const disciplineId = t.discipline.id
          const disciplineName = t.discipline.title

          // Encontra ou cria curso
          let course = acc.find(c => c.courseId === courseId)
          if (!course) {
            course = { courseId, courseName, disciplines: [] }
            acc.push(course)
          }

          // Encontra ou cria disciplina dentro do curso
          let discipline = course.disciplines.find(d => d.disciplineId === disciplineId)
          if (!discipline) {
            discipline = { disciplineId, disciplineName, tasks: [] }
            course.disciplines.push(discipline)
          }

          // Adiciona a tarefa
          discipline.tasks.push({
            id: t.id,
            title: t.title,
            description: t.description,
            dueDate: t.dueDate,
            type: t.type,
          })

          return acc
        },
        [],
      )

      return reply.status(200).send({ tasks: grouped })
    },
  )
}