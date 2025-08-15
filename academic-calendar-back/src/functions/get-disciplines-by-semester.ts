import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'

interface GetDisciplinesProps {
  userId: string
  semesterId: string
}

export async function getDisciplinesBySemester({
  userId,
  semesterId,
}: GetDisciplinesProps) {
  // Primeiro, verifica se o semestre pertence a um curso do usuário
  const semester = await db.query.semesters.findFirst({
    where: (fields) => eq(fields.id, semesterId),
    with: {
      course: true,
    },
  })

  if (!semester || semester.course.userId !== userId) {
    return { disciplines: [] }
  }

  // Busca as disciplinas desse semestre
  const disciplines = await db.query.disciplines.findMany({
    where: (fields) => eq(fields.semesterId, semesterId),
  })

  return { disciplines }
}
