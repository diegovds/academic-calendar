import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { tasks } from '../drizzle/schema/schema'

interface CreateTaskProps {
  userId: string
  title: string
  description: string
  dueDate: Date
  type: 'exam' | 'activity'
  disciplineId: string
}

export async function createTask({
  title,
  description,
  dueDate,
  type,
  disciplineId,
  userId,
}: CreateTaskProps) {
  // Verifica se a disciplina pertence ao usuário
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

  const courseOwnerId = discipline?.semester.course.userId

  if (!discipline || courseOwnerId !== userId) {
    return { task: null, error: 'Disciplina não pertence ao usuário.' }
  }

  const [task] = await db
    .insert(tasks)
    .values({
      title,
      description,
      dueDate,
      type,
      disciplineId,
    })
    .returning()

  return { task }
}
