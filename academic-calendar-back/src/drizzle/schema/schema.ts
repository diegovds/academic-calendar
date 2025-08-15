// schema.ts
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// USERS
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
}))

// COURSES
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  semesters: many(semesters),
}))

// SEMESTERS
export const semesters = pgTable('semesters', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  course: one(courses, {
    fields: [semesters.courseId],
    references: [courses.id],
  }),
  disciplines: many(disciplines),
}))

// DISCIPLINES
export const disciplines = pgTable('disciplines', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  semesterId: uuid('semester_id')
    .notNull()
    .references(() => semesters.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const disciplinesRelations = relations(disciplines, ({ one, many }) => ({
  semester: one(semesters, {
    fields: [disciplines.semesterId],
    references: [semesters.id],
  }),
  tasks: many(tasks),
}))

// TASKS
export const taskTypeEnum = pgEnum('task_type', ['exam', 'activity'])

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  dueDate: timestamp('due_date', { mode: 'date' }).notNull(),
  type: taskTypeEnum('type').notNull(),
  disciplineId: uuid('discipline_id')
    .notNull()
    .references(() => disciplines.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const tasksRelations = relations(tasks, ({ one }) => ({
  discipline: one(disciplines, {
    fields: [tasks.disciplineId],
    references: [disciplines.id],
  }),
}))
