import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'

interface signinProps {
  email: string
}

export async function signin({ email }: signinProps) {
  const user = await db.query.users.findFirst({
    where: (fields) => eq(fields.email, email),
  })

  return {
    user: user ?? null,
  }
}
