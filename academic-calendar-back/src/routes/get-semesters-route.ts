import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getSemestersByCourse } from '../functions/get-semesters-by-course'
import { semesterSchema } from '../types/zod'

export const getSemestersRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/courses/:courseId/semesters',
    {
      schema: {
        summary: 'Get semesters from authenticated user course',
        tags: ['semesters'],
        security: [{ bearerAuth: [] }], // rota protegida com token
        params: z.object({
          courseId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            semesters: z.array(semesterSchema),
          }),
          404: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
      preHandler: [app.authenticate], // middleware de autenticação
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { courseId } = request.params

      const { semesters } = await getSemestersByCourse({ userId, courseId })

      if (semesters.length === 0) {
        return reply.status(404).send({
          message: 'Nenhum semestre encontrado para esse curso e usuário.',
        })
      }

      return reply.status(200).send({ semesters })
    },
  )
}
