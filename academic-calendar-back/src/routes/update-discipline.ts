import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { updateDiscipline } from '../functions/update-discipline'

export const updateDisciplineRoute: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/disciplines/:disciplineId',
    {
      schema: {
        summary: 'Update a discipline (owned by the authenticated user)',
        tags: ['disciplines'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          disciplineId: z.uuid(),
        }),
        body: z.object({
          title: z.string().min(1).optional(),
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
      const data = request.body

      const result = await updateDiscipline({ userId, disciplineId, data })

      if ('error' in result) {
        return reply.status(404).send({ message: result.error })
      }

      return reply.status(200).send({ success: true })
    },
  )
}
