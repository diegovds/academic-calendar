import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { courses } from '../drizzle/schema/schema'

interface UpdateCourseProps {
  userId: string
  courseId: string
  data: {
    title?: string
    description?: string
  }
}

export async function updateCourse({ userId, courseId, data }: UpdateCourseProps) {
  // Busca o curso pelo ID e verifica se pertence ao usuário
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  })

  if (!course || course.userId !== userId) {
    return { error: 'Course not found or not owned by user' }
  }

  // Atualiza os campos fornecidos e o updatedAt
  await db
    .update(courses)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(courses.id, courseId))

  return { success: true }
}
