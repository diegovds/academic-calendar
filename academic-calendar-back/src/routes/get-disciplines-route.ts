import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getDisciplinesBySemester } from '../functions/get-disciplines-by-semester'
import { disciplineSchema } from '../types/zod'

export const getDisciplinesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/semesters/:semesterId/disciplines',
    {
      schema: {
        summary: 'Get disciplines from a semester of authenticated user',
        tags: ['disciplines'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          semesterId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            disciplines: z.array(disciplineSchema),
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
      const { semesterId } = request.params

      const { disciplines } = await getDisciplinesBySemester({
        userId,
        semesterId,
      })

      if (disciplines.length === 0) {
        return reply.status(404).send({
          message:
            'Nenhuma disciplina encontrada para este semestre e usuário.',
        })
      }

      return reply.status(200).send({ disciplines })
    },
  )
}
