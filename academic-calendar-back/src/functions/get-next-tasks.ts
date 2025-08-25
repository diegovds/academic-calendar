import { gte } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'

interface GetNextTasksProps {
  userId: string
}

export async function getNextTasks({ userId }: GetNextTasksProps) {
  const now = new Date()

  const nextTasks = await db.query.tasks.findMany({
    where: (fields) =>
      gte(fields.dueDate, now),
    with: {
      discipline: {
        with: {
          semester: {
            with: {
              course: true,
            },
          },
        },
      },
    },
    orderBy: (fields) => fields.dueDate,
    limit: 6,
  })

  // Filtra só as tasks do usuário
  const userTasks = nextTasks.filter(
    (t) => t.discipline.semester.course.userId === userId
  )

  return { tasks: userTasks }
}
