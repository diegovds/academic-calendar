import { Button } from '@/components/button'
import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import { Page } from '@/components/page'
import {
  type GetCoursesCourseId200Course,
  getCoursesCourseId,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'
import { SemesterCreate } from './-components/semester-create'
import { SemesterGrid } from './-components/semester-grid'

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
  const { setIsOpen, whoOpened, setWhoOpened, toggleWhoOpened } =
    useModalStore()

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

  const queryClient = useQueryClient()

  function handleReload(reload: boolean) {
    if (reload) {
      queryClient.invalidateQueries({ queryKey: ['course', token, courseId] })
      toggleWhoOpened()
    }
  }

  useEffect(() => {
    if (!token) navigate({ to: '/' })
  }, [token, navigate])

  useEffect(() => {
    if (!isLoading && !course) navigate({ to: '/my-calendar' })
  }, [isLoading, course, navigate])

  if (isLoading || !course) return <EmptyMessage text="Carregando..." />

  return (
    <Page>
      <h1 className="text-foreground text-lg line-clamp-1 md:text-2xl">
        Curso: {course.title}
      </h1>
      <p className="text-sm md:text-base text-foreground mt-1 mb-4">
        {course.description}
      </p>

      <Button
        type="button"
        className="md:w-fit w-full px-3 p-2 mb-6 mt-0"
        onClick={() => {
          setIsOpen(true)
          setWhoOpened('semester')
        }}
      >
        Cadastrar semestre
      </Button>

      {course.semesters.length > 0 && (
        <SemesterGrid semesters={course.semesters} />
      )}

      {whoOpened === 'semester' && (
        <Modal onClose={() => setIsOpen(false)} title="Cadastro de semestre">
          <SemesterCreate courseId={course.id} reload={handleReload} />
        </Modal>
      )}
    </Page>
  )
}
