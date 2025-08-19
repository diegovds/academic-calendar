import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getCourseByUser } from '../functions/get-course-by-user'
import { semesterSchema } from '../types/zod'

const courseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  userId: z.uuid(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  semesters: z.array(semesterSchema),
})

export const getCourseRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/courses/:courseId',
    {
      schema: {
        summary: 'Get course from authenticated user',
        tags: ['courses'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          courseId: z.uuid(),
        }),
        response: {
          200: z.object({
            course: courseSchema.nullish(),
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
      const { courseId } = request.params

      const { course } = await getCourseByUser({ userId, courseId })

      return reply.status(200).send({ course })
    },
  )
}
