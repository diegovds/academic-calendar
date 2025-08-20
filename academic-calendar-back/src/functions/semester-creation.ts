import { and, eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { semesters } from '../drizzle/schema/schema'

interface SemesterCreationProps {
  semester: 'first' | 'second'
  courseId: string
  userId: string
  year: string
}

export async function SemesterCreation({
  semester,
  courseId,
  userId,
  year,
}: SemesterCreationProps) {
  const course = await db.query.courses.findFirst({
    where: (c) => eq(c.id, courseId) && eq(c.userId, userId),
  })

  if (!course) return { semester: null }

  const existingSemesters = await db.query.semesters.findMany({
    where: (s) => and(eq(s.courseId, courseId), eq(s.year, year)),
  })

  const semesterExists = existingSemesters.some(
    (s) => s.semester === semester
  )
  if (semesterExists) return { semester: null }

  const newSemester = await db
    .insert(semesters)
    .values({ courseId, semester, year })
    .returning()

  return {
    semester: newSemester[0] ?? null,
  }
}
