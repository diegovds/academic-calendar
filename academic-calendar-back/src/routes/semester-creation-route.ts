import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { semesterCreation } from '../functions/semester-creation'
import { semesterSchema } from '../types/zod'

export const semesterCreationRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/semesters',
    {
      schema: {
        summary: 'Semester creation on the platform',
        tags: ['semesters'],
        security: [{ bearerAuth: [] }], // Isso mostra que a rota exige token
        body: z.object({
          title: z.string().min(2, {
            message: 'o title deve ter pelo menos 2 caracteres',
          }),
          courseId: z.uuid(),
        }),
        response: {
          201: z.object({
            semester: semesterSchema,
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
      const { courseId, title } = request.body

      const { semester } = await semesterCreation({
        courseId,
        title,
      })

      if (semester) {
        return reply.status(201).send({ semester })
      }

      if (!semester) {
        return reply.status(404).send({
          message: 'Semestre não cadastrado.',
        })
      }

      return reply.status(400).send({ message: 'Ocorreu um erro no servidor.' })
    },
  )
}
