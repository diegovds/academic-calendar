import { and, eq } from "drizzle-orm"
import { db } from '../drizzle/drizzle'

interface GetCoursesByUserProps {
  userId: string
  courseId: string
}

export async function getCourseByUser({ userId, courseId }: GetCoursesByUserProps) {
  const course = await db.query.courses.findFirst({
  where: (fields) =>
    and(eq(fields.id, courseId), eq(fields.userId, userId)),
  })

  return { course }
}
