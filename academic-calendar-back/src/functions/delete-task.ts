import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { tasks } from '../drizzle/schema/schema'

interface DeleteTaskProps {
  userId: string
  taskId: string
}

export async function deleteTask({ userId, taskId }: DeleteTaskProps) {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
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
  })

  if (!task || task.discipline.semester.course.userId !== userId) {
    return { error: 'Task not found or not owned by user' }
  }

  await db.delete(tasks).where(eq(tasks.id, taskId))

  return { success: true }
}
