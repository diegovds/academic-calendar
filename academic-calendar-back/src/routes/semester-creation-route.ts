import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { semesterCreation } from '../functions/semester-creation'
import { semesterSchema, semesterTypeEnum } from '../types/zod'

export const semesterCreationRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/semesters',
    {
      schema: {
        summary: 'Semester creation on the platform',
        tags: ['semesters'],
        security: [{ bearerAuth: [] }], // Isso mostra que a rota exige token
        body: z.object({
          semester: semesterTypeEnum,
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
      const { courseId, semester } = request.body

      const { semester: _semester } = await semesterCreation({
        courseId,
        semester,
      })

      if (_semester) {
        return reply.status(201).send({ semester: _semester })
      }

      if (!_semester) {
        return reply.status(404).send({
          message: 'Semestre não cadastrado.',
        })
      }

      return reply.status(400).send({ message: 'Ocorreu um erro no servidor.' })
    },
  )
}
