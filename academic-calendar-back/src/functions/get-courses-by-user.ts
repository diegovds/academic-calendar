import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'

interface GetCoursesByUserProps {
  userId: string
}

export async function getCoursesByUser({ userId }: GetCoursesByUserProps) {
  const courses = await db.query.courses.findMany({
    where: (fields) => eq(fields.userId, userId),
  })

  return { courses }
}
