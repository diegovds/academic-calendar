import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteDiscipline } from '../functions/delete-discipline'


export const deleteDisciplineRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/disciplines/:disciplineId',
    {
      schema: {
        summary: 'Delete a discipline (owned by the authenticated user)',
        tags: ['disciplines'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          disciplineId: z.uuid(),
        }),
        response: {
          200: z.object({ success: z.literal(true) }),
          404: z.object({ message: z.string().nullish() }),
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { disciplineId } = request.params
      const userId = request.user.sub

      const result = await deleteDiscipline({ userId, disciplineId })

      if ('error' in result) {
        return reply.status(404).send({ message: result.error })
      }

      return reply.status(200).send({ success: true })
    },
  )
}
