import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'

export async function getUserWithCoursesAndSemesters(userId: string) {
  const userWithCoursesAndSemesters = await db.query.users.findFirst({
    where: (fields) => eq(fields.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      courses: {
        with: {
          semesters: {
            with: {
              disciplines: true,
            },
          },
        },
      },
    },
  })

  return {
    user: userWithCoursesAndSemesters ?? null,
  }
}
