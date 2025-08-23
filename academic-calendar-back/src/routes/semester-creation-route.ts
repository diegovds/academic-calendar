import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { SemesterCreation } from '../functions/semester-creation'
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
          year: z.number().int().gte(new Date().getFullYear()).lte(new Date().getFullYear() + 1).transform((val) => String(val)),
          courseId: z.uuid(),
        }),
        response: {
          201: z.object({
            semester: semesterSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
      preHandler: [app.authenticate], // Protegendo a rota
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { courseId, semester, year } = request.body

      const { semester: _semester } = await SemesterCreation({
        courseId,
        semester,
        year,
        userId,
      })

      if (_semester) {
        return reply.status(201).send({ semester: _semester })
      }

      if (!_semester) {
        return reply.status(400).send({
          message: 'Semestre não cadastrado ou o limite de semestres por ano foi atingido.',
        })
      }

      return reply.status(500).send({ message: 'Ocorreu um erro no servidor.' })
    },
  )
}
