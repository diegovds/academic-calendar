import { db } from '../drizzle/drizzle'
import { semesters } from '../drizzle/schema/schema'

interface semesterCreationProps {
  title: string
  courseId: string
}

export async function semesterCreation({
  title,
  courseId,
}: semesterCreationProps) {
  const newSemester = await db
    .insert(semesters)
    .values({ courseId, title })
    .returning()

  return {
    semester: newSemester[0] ?? null,
  }
}
