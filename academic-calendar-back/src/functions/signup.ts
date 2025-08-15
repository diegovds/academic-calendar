import { db } from '../drizzle/drizzle'
import { users } from '../drizzle/schema/schema'

interface signupProps {
  name: string
  email: string
  password: string
}

export async function signup({ name, email, password }: signupProps) {
  const newUser = await db
    .insert(users)
    .values({ name, email, password })
    .returning()

  return {
    user: newUser[0] ?? null,
  }
}
