import { db } from '../drizzle/drizzle'
import { courses } from '../drizzle/schema/schema'

interface courseCreationProps {
  description: string
  title: string
  userId: string
}

export async function courseCreation({
  description,
  title,
  userId,
}: courseCreationProps) {
  const newCourse = await db
    .insert(courses)
    .values({ description, title, userId })
    .returning()

  return {
    course: newCourse[0] ?? null,
  }
}
