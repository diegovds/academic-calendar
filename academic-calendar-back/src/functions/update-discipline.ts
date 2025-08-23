import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { disciplines } from '../drizzle/schema/schema'

interface UpdateDisciplineProps {
  userId: string
  disciplineId: string
  data: {
    title?: string
  }
}

export async function updateDiscipline({ userId, disciplineId, data }: UpdateDisciplineProps) {
  // Busca a disciplina e navega até o curso para verificar o dono
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

  // Atualiza os dados
  await db
    .update(disciplines)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(disciplines.id, disciplineId))

  return { success: true }
}
