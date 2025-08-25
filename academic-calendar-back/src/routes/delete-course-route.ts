import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { deleteCourse } from "../functions/delete-course"

export const deleteCourseRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Delete a course",
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.uuid("O ID do curso deve ser um UUID válido"),
        }),
        response: {
          200: z.object({ success: z.literal(true) }),
          404: z.object({ message: z.string().nullish() }),
        },
      },
      preHandler: [app.authenticate], // garante usuário autenticado
    },
    async (request, reply) => {
      const { id } = request.params
      const userId = request.user.sub

      const result = await deleteCourse({ courseId: id, userId })

      if ('error' in result) {
        return reply.status(404).send({ message: result.error })
      }

      return reply.status(200).send({ success: true })
    }
  )
}
