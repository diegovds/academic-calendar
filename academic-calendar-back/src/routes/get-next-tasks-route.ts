import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getNextTasks } from '../functions/get-next-tasks'

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
            tasks: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                dueDate: z.date(),
                type: z.enum(['exam', 'activity']),
              })
            ),
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

      return reply.status(200).send({ tasks: result.tasks })
    },
  )
}
