import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { updateTask } from '../functions/update-task'

export const updateTaskRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/tasks/:taskId',
    {
      schema: {
        summary: 'Update a task (owned by the authenticated user)',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          taskId: z.uuid(),
        }),
        body: z.object({
          title: z.string().min(1).optional(),
          description: z.string().min(1).optional(),
          dueDate: z.coerce.date().optional(),
          type: z.enum(['exam', 'activity']).optional(),
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
      const data = request.body

      const result = await updateTask({ userId, taskId, data })

      if ('error' in result) {
        return reply.status(404).send({ message: result.error })
      }

      return reply.status(200).send({ success: true })
    },
  )
}
