import { EmptyMessage } from '@/components/empty-message'
import { Page } from '@/components/page'
import {
  type GetCoursesCourseId200Course,
  getCoursesCourseId,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'

const courseIdSchema = z.object({
  id: z.uuid('O id do curso deve ser um UUID válido'),
})

export const Route = createFileRoute('/_pages/course/$id')({
  beforeLoad: ({ params }) => {
    const parseResult = courseIdSchema.safeParse(params)
    if (!parseResult.success) {
      throw redirect({ to: '/' })
    }

    return {
      courseId: parseResult.data.id,
    }
  },
  component: CoursePage,
})

function CoursePage() {
  const { courseId } = Route.useRouteContext()
  const navigate = useNavigate()
  const { token } = useAuthStore()

  const courseQuery = useQuery<GetCoursesCourseId200Course | null>({
    queryKey: ['course', token, courseId],
    queryFn: async () => {
      const res = await getCoursesCourseId(courseId, {
        headers: { Authorization: `Bearer ${token}` },
      })

      return res.course ?? null
    },
    enabled: !!token && !!courseId,
  })

  const { data: course, isLoading } = courseQuery

  useEffect(() => {
    if (!token) navigate({ to: '/' })
  }, [token, navigate])

  useEffect(() => {
    if (!isLoading && !course) navigate({ to: '/my-calendar' })
  }, [isLoading, course, navigate])

  if (isLoading || !course) return <EmptyMessage text="Carregando..." />

  return (
    <Page>
      <h1>Curso: {course.title}</h1>
      <p>{course.description}</p>
      {course.semesters?.map(semester => (
        <div key={semester.id}>{semester.semester}</div>
      ))}
    </Page>
  )
}
