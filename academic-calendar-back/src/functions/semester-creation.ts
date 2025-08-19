import { db } from '../drizzle/drizzle'
import { semesters } from '../drizzle/schema/schema'

interface semesterCreationProps {
  semester: 'first' | 'second'
  courseId: string
}

export async function semesterCreation({
  semester,
  courseId,
}: semesterCreationProps) {
  const newSemester = await db
    .insert(semesters)
    .values({ courseId, semester })
    .returning()

  return {
    semester: newSemester[0] ?? null,
  }
}
