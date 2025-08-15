import { z } from 'zod'

export const disciplineSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  semesterId: z.string(),
})

export const semesterSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  courseId: z.uuid(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
})

export const courseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  userId: z.uuid(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
})

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
})

export const taskTypeEnum = z.enum(['exam', 'activity'])

export const taskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  dueDate: z.date().nullable(),
  type: taskTypeEnum,
  disciplineId: z.uuid(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
})

export const semesterWithDisciplinesSchema = semesterSchema.extend({
  disciplines: z.array(disciplineSchema),
})

export const courseWithSemestersSchema = courseSchema.extend({
  semesters: z.array(semesterWithDisciplinesSchema),
})

export const userWithCoursesAndSemestersSchema = userSchema.extend({
  courses: z.array(courseWithSemestersSchema),
})
