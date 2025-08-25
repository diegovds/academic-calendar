import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { courses } from '../drizzle/schema/schema'

interface DeleteCourseProps {
  userId: string
  courseId: string
}

export async function deleteCourse({ userId, courseId }: DeleteCourseProps) {
  // Busca o curso e valida se pertence ao usuário
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  })

  if (!course || course.userId !== userId) {
    return { error: 'Course not found or not owned by user' }
  }

  // Deleta o curso (semestres, disciplinas e tasks serão removidos em cascade)
  await db.delete(courses).where(eq(courses.id, courseId))

  return { success: true }
}
