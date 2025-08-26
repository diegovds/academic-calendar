import { eq, InferSelectModel } from 'drizzle-orm';
import { db } from '../drizzle/drizzle';
import { users } from '../drizzle/schema/schema';

interface SignupProps {
  name: string;
  email: string;
  password: string;
}

type User = InferSelectModel<typeof users>

type SignupResult =
  | { user: User | null; error?: never }
  | { user?: never; error: string };

export async function signup({ name, email, password }: SignupProps):Promise<SignupResult> {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return { error: 'E-mail já cadastrado.' };
  }

  const newUser = await db
    .insert(users)
    .values({ name, email, password })
    .returning();

  return {
    user: newUser[0] ?? null,
  };
}
