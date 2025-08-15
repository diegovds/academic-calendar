import { db } from '../drizzle/drizzle'
import { disciplines } from '../drizzle/schema/schema'

interface disciplineCreationProps {
  title: string
  semesterId: string
}

export async function disciplineCreation({
  title,
  semesterId,
}: disciplineCreationProps) {
  const newDiscipline = await db
    .insert(disciplines)
    .values({ semesterId, title })
    .returning()

  return {
    discipline: newDiscipline[0] ?? null,
  }
}
