import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getCoursesByUser } from '../functions/get-courses-by-user'
import { courseSchema } from '../types/zod'

export const getCoursesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/courses',
    {
      schema: {
        summary: 'Get courses from authenticated user',
        tags: ['courses'],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            courses: z.array(courseSchema),
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

      const { courses } = await getCoursesByUser({ userId })

      if (courses.length === 0) {
        return reply.status(404).send({
          message: 'Nenhum curso encontrado para este usuário.',
        })
      }

      return reply.status(200).send({ courses })
    },
  )
}
