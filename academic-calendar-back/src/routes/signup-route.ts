import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { signup } from '../functions/signup'

export const signupRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/signup',
    {
      schema: {
        summary: 'Sign up on the platform',
        tags: ['auth'],
        security: [],
        body: z.object({
          name: z
            .string()
            .min(2, { message: 'o nome deve ter pelo menos 2 caracteres' }),
          email: z.email({ message: 'E-mail não válido' }),
          password: z
            .string()
            .min(6, { message: 'a senha deve ter pelo menos 6 caracteres' }),
        }),
        response: {
          201: z.object({
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
      const { name, email, password } = request.body

      const passwordHash = await app.bcrypt.hash(password)

      const { user } = await signup({
        name,
        email,
        password: passwordHash,
      })

      if (user) {
        const token = app.jwt.sign(
          {
            name: user.name,
          },
          {
            sub: user.id,
            expiresIn: '30 days',
          },
        )

        return reply.status(201).send({ token })
      }

      if (!user) {
        return reply.status(404).send({
          message: 'Usuário não cadastrado.',
        })
      }

      return reply.status(400).send({ message: 'Ocorreu um erro no servidor.' })
    },
  )
}
