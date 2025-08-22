import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import { Page } from '@/components/page'
import { Button } from '@/components/ui/button'
import { type GetCourses200CoursesItem, getCourses } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { CourseCreate } from './-components/course-create'
import { CourseItem } from './-components/course-item'

export const Route = createFileRoute('/_pages/my-calendar/')({
  component: MyCalendarComponent,
})

function MyCalendarComponent() {
  const navigate = useNavigate()
  const { token, name } = useAuthStore()
  const { setIsOpen } = useModalStore()
  const { reset } = useTaskStore()

  useEffect(() => {
    if (!token) navigate({ to: '/' })
    reset()
  }, [token, navigate, reset])

  const coursesQuery = useQuery<GetCourses200CoursesItem[]>({
    queryKey: ['courses', token],
    queryFn: async () => {
      const res = await getCourses({
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.courses
    },
    enabled: !!token,
  })

  const { data: courses, isLoading } = coursesQuery

  const queryClient = useQueryClient()

  function handleReload(reload: boolean) {
    if (reload) {
      queryClient.invalidateQueries({ queryKey: ['courses', token] })
    }
  }

  useEffect(() => {
    if (!isLoading && !courses) navigate({ to: '/' })
  }, [isLoading, courses, navigate])

  if (isLoading || !courses) return <EmptyMessage text="Carregando..." />

  return (
    <Page className="flex flex-col">
      <div className="flex md:items-center md:gap-0 gap-2 md:justify-between flex-col md:flex-row">
        <h1 className="text-foreground text-lg line-clamp-1 md:text-2xl">
          Olá, {name}
        </h1>
        {courses.length > 0 && (
          <Button
            type="button"
            className="md:w-fit w-full px-3"
            onClick={() => setIsOpen(true)}
          >
            Cadastrar curso
          </Button>
        )}
      </div>

      {courses.length === 0 ? (
        <EmptyMessage text="Você não possui cursos">
          <Button
            type="button"
            className="w-fit px-3"
            onClick={() => setIsOpen(true)}
          >
            Cadastrar curso
          </Button>
        </EmptyMessage>
      ) : (
        <>
          <h3 className="md:text-xl text-foreground my-4">Cursos:</h3>
          <div className="grid md:grid-cols-2 gap-4 md:gap-10 items-center">
            {courses.map(course => (
              <CourseItem
                key={course.id}
                description={course.description}
                id={course.id}
                title={course.title}
                to="/course/$id"
              />
            ))}
          </div>
        </>
      )}

      <Modal onClose={() => setIsOpen(false)} title="Cadastro de curso">
        <CourseCreate reload={handleReload} />
      </Modal>
    </Page>
  )
}
