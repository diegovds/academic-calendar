import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { updateCourse } from '../functions/update-course'

export const updateCourseRoute: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/courses/:courseId',
    {
      schema: {
        summary: 'Update a course (owned by the authenticated user)',
        tags: ['courses'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          courseId: z.uuid(),
        }),
        body: z.object({
          title: z.string().min(1).optional(),
          description: z.string().min(1).optional(),
        }),
        response: {
          200: z.object({ success: z.literal(true) }),
          404: z.object({ message: z.string().nullish() }),
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { courseId } = request.params
      const userId = request.user.sub
      const data = request.body

      const result = await updateCourse({ userId, courseId, data })

      if ('error' in result) {
        return reply.status(404).send({ message: result.error })
      }

      return reply.status(200).send({ success: true })
    },
  )
}
