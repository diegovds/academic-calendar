import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env'
import * as schema from './schema/schema'

const pg = postgres(env.POSTGRES_URL)
export const db = drizzle(pg, { schema })
