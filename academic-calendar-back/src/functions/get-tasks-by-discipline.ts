import { asc, eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'

interface GetTasksProps {
  userId: string
  disciplineId: string
}

export async function getTasksByDiscipline({
  userId,
  disciplineId,
}: GetTasksProps) {
  // Verifica se a disciplina pertence ao usuário via disciplina, semestre, curso
  const discipline = await db.query.disciplines.findFirst({
    where: (fields) => eq(fields.id, disciplineId),
    with: {
      semester: {
        with: {
          course: true,
        },
      },
    },
  })

  if (!discipline || discipline.semester.course.userId !== userId) {
    return { tasks: [] }
  }

  const tasks = await db.query.tasks.findMany({
    where: (fields) => eq(fields.disciplineId, disciplineId),
    orderBy: (fields) => asc(fields.dueDate),
  })

  return { tasks }
}
