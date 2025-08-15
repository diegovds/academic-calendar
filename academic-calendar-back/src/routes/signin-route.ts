import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { signin } from '../functions/signin'

export const signinRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/signin',
    {
      schema: {
        summary: 'Sign in on the platform',
        tags: ['auth'],
        security: [],
        body: z.object({
          email: z.email({ message: 'E-mail não válido' }),
          password: z
            .string()
            .min(6, { message: 'a senha deve ter pelo menos 6 caracteres' }),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const { user } = await signin({
        email,
      })

      if (user !== null) {
        const passwordVerify = await app.bcrypt.compare(password, user.password)

        if (passwordVerify) {
          const token = app.jwt.sign(
            {
              name: user.name,
            },
            {
              sub: user.id,
              expiresIn: '30 days',
            },
          )

          return reply.status(200).send({ token })
        }

        return reply.status(404).send({
          message: 'Usuário não encontrado.',
        })
      }

      if (!user) {
        return reply.status(404).send({
          message: 'Usuário não encontrado.',
        })
      }

      return reply.status(400).send({ message: 'Ocorreu um erro no servidor.' })
    },
  )
}
