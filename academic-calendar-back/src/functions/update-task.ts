import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { tasks } from '../drizzle/schema/schema'

interface UpdateTaskProps {
  userId: string
  taskId: string
  data: {
    title?: string
    description?: string
    dueDate?: Date
    type?: 'exam' | 'activity'
  }
}

export async function updateTask({ userId, taskId, data }: UpdateTaskProps) {
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

  await db
    .update(tasks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))

  return { success: true }
}
