import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getUserWithCoursesAndSemesters } from '../functions/get-user-with-courses-and-semesters'
import { userWithCoursesAndSemestersSchema } from '../types/zod'

export const getUserWithCoursesAndSemestersRoute: FastifyPluginAsyncZod =
  async (app) => {
    app.get(
      '/users',
      {
        schema: {
          summary: 'Get user with courses and semesters',
          tags: ['users'],
          security: [{ bearerAuth: [] }], // Isso mostra que a rota exige token
          response: {
            200: z.object({
              user: userWithCoursesAndSemestersSchema,
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
        const { user } = await getUserWithCoursesAndSemesters(request.user.sub)

        if (user) {
          return reply.status(200).send({ user })
        }

        if (!user) {
          return reply.status(404).send({
            message: 'Usuário não encontrado.',
          })
        }

        return reply
          .status(400)
          .send({ message: 'Ocorreu um erro no servidor.' })
      },
    )
  }
