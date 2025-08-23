import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteTask } from '../functions/delete-task'

export const deleteTaskRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/tasks/:taskId',
    {
      schema: {
        summary: 'Delete a task (owned by the authenticated user)',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          taskId: z.uuid(),
        }),
        response: {
          200: z.object({ success: z.literal(true) }),
          404: z.object({ message: z.string().nullish() }),
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { taskId } = request.params
      const userId = request.user.sub

      const result = await deleteTask({ userId, taskId })

      if ('error' in result) {
        return reply.status(404).send({ message: result.error })
      }

      return reply.status(200).send({ success: true })
    },
  )
}
