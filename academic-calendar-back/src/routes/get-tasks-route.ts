import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getTasksByDiscipline } from '../functions/get-tasks-by-discipline'
import { taskSchema } from '../types/zod'

export const getTasksRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/disciplines/:disciplineId/tasks',
    {
      schema: {
        summary: 'Get tasks of a discipline for authenticated user',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          disciplineId: z.uuid(),
        }),
        response: {
          200: z.object({
            tasks: z.array(taskSchema),
          }),
          404: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { disciplineId } = request.params

      const { tasks } = await getTasksByDiscipline({ userId, disciplineId })

      if (tasks.length === 0) {
        return reply.status(404).send({
          message: 'Nenhuma task encontrada para essa disciplina.',
        })
      }

      return reply.status(200).send({ tasks })
    },
  )
}
