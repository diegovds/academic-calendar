import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'

interface GetSemestersProps {
  userId: string
  courseId: string
}

export async function getSemestersByCourse({
  userId,
  courseId,
}: GetSemestersProps) {
  // Verifica se o curso pertence ao usuário
  const course = await db.query.courses.findFirst({
    where: (fields) => eq(fields.id, courseId),
  })

  if (!course || course.userId !== userId) {
    return { semesters: [] }
  }

  // Busca os semestres relacionados ao curso
  const semesters = await db.query.semesters.findMany({
    where: (fields) => eq(fields.courseId, courseId),
  })

  return { semesters }
}
