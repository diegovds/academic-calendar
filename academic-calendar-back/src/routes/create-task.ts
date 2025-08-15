import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createTask } from '../functions/create-task'
import { taskSchema, taskTypeEnum } from '../types/zod'

export const createTaskRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/tasks',
    {
      schema: {
        summary: 'Create task for a discipline',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        body: z.object({
          title: z.string().min(3),
          description: z.string().min(5),
          dueDate: z.coerce.date(),
          type: taskTypeEnum, // 'exam' ou 'task'
          disciplineId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            task: taskSchema,
          }),
          400: z.object({
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
      const userId = request.user.sub as string
      const { title, description, dueDate, type, disciplineId } = request.body

      const { task, error } = await createTask({
        title,
        description,
        dueDate,
        type,
        disciplineId,
        userId,
      })

      if (!task) {
        return reply.status(400).send({
          message: error ?? 'Erro ao criar a task.',
        })
      }

      return reply.status(201).send({ task })
    },
  )
}
