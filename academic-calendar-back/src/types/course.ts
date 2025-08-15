import { InferSelectModel } from 'drizzle-orm'
import { courses } from '../drizzle/schema/schema'

export type Course = InferSelectModel<typeof courses>
