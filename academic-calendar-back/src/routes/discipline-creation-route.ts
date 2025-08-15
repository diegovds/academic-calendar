import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { disciplineCreation } from '../functions/discipline-creation'
import { disciplineSchema } from '../types/zod'

export const disciplineCreationRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/disciplines',
    {
      schema: {
        summary: 'Discipline creation on the platform',
        tags: ['disciplines'],
        security: [{ bearerAuth: [] }], // Isso mostra que a rota exige token
        body: z.object({
          title: z.string().min(2, {
            message: 'o title deve ter pelo menos 2 caracteres',
          }),
          semesterId: z.uuid(),
        }),
        response: {
          201: z.object({
            discipline: disciplineSchema,
          }),
          404: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
      preHandler: [app.authenticate], // Protegendo a rota
    },
    async (request, reply) => {
      const { semesterId, title } = request.body

      const { discipline } = await disciplineCreation({
        semesterId,
        title,
      })

      if (discipline) {
        return reply.status(201).send({ discipline })
      }

      if (!discipline) {
        return reply.status(404).send({
          message: 'Disciplina não cadastrada.',
        })
      }

      return reply.status(400).send({ message: 'Ocorreu um erro no servidor.' })
    },
  )
}
