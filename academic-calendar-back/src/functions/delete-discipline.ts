import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { disciplines } from '../drizzle/schema/schema'

interface DeleteDisciplineProps {
  userId: string
  disciplineId: string
}

export async function deleteDiscipline({ userId, disciplineId }: DeleteDisciplineProps) {
  // Busca a disciplina e valida se pertence ao usuário
  const discipline = await db.query.disciplines.findFirst({
    where: eq(disciplines.id, disciplineId),
    with: {
      semester: {
        with: {
          course: true,
        },
      },
    },
  })

  if (!discipline || discipline.semester.course.userId !== userId) {
    return { error: 'Discipline not found or not owned by user' }
  }

  // Deleta a disciplina
  await db.delete(disciplines).where(eq(disciplines.id, disciplineId))

  return { success: true }
}
