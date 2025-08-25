import { fastifyCors } from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyBcrypt from 'fastify-bcrypt'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from '../src/env'
import { courseCreationRoute } from '../src/routes/course-creation-route'
import { createTaskRoute } from '../src/routes/create-task'
import { deleteCourseRoute } from '../src/routes/delete-course-route'
import { deleteDisciplineRoute } from '../src/routes/delete-discipline-route'
import { deleteTaskRoute } from '../src/routes/delete-task-route'
import { disciplineCreationRoute } from '../src/routes/discipline-creation-route'
import { getCourseRoute } from '../src/routes/get-course-route'
import { getCoursesRoute } from '../src/routes/get-courses-route'
import { getDisciplinesRoute } from '../src/routes/get-disciplines-route'
import { nextTasksRoute } from '../src/routes/get-next-tasks-route'
import { getSemestersRoute } from '../src/routes/get-semesters-route'
import { getTasksRoute } from '../src/routes/get-tasks-route'
import { semesterCreationRoute } from '../src/routes/semester-creation-route'
import { signinRoute } from '../src/routes/signin-route'
import { signupRoute } from '../src/routes/signup-route'
import { updateCourseRoute } from '../src/routes/update-course-route'
import { updateDisciplineRoute } from '../src/routes/update-discipline'
import { updateTaskRoute } from '../src/routes/update-task-route'


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

app.register(fastifyBcrypt, {
  saltWorkFactor: 10,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
})

// Decorator de autenticação
app.decorate(
  'authenticate',
  async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.status(401).send({ message: 'Não autorizado' })
    }
  },
)

// Declaração de tipo para o decorator
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>
  }
}

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Academic Calendar',
      version: '0.0.1',
      description: 'API para o Academic Calendar',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(signupRoute)
app.register(signinRoute)
app.register(courseCreationRoute)
app.register(semesterCreationRoute)
app.register(disciplineCreationRoute)
app.register(getSemestersRoute)
app.register(getCoursesRoute)
app.register(getCourseRoute)
app.register(getDisciplinesRoute)
app.register(getTasksRoute)
app.register(createTaskRoute)
app.register(deleteTaskRoute)
app.register(updateTaskRoute)
app.register(updateCourseRoute)
app.register(updateDisciplineRoute)
app.register(deleteDisciplineRoute)
app.register(deleteCourseRoute)
app.register(nextTasksRoute)

export default async (req: any, res: any) => {
  await app.ready()
  app.server.emit('request', req, res)
}
