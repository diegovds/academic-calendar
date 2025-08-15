import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { courseCreation } from '../functions/course-creation'
import { courseSchema } from '../types/zod'

export const courseCreationRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/courses',
    {
      schema: {
        summary: 'Course creation on the platform',
        tags: ['courses'],
        security: [{ bearerAuth: [] }], // Isso mostra que a rota exige token
        body: z.object({
          description: z.string().min(2, {
            message: 'a descrição deve ter pelo menos 2 caracteres',
          }),
          title: z
            .string()
            .min(6, { message: 'o título deve ter pelo menos 6 caracteres' }),
        }),
        response: {
          201: z.object({
            course: courseSchema,
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
      const { description, title } = request.body

      const { course } = await courseCreation({
        description,
        title,
        userId: request.user.sub,
      })

      if (course) {
        return reply.status(201).send({ course })
      }

      if (!course) {
        return reply.status(404).send({
          message: 'Curso não cadastrado.',
        })
      }

      return reply.status(400).send({ message: 'Ocorreu um erro no servidor.' })
    },
  )
}
