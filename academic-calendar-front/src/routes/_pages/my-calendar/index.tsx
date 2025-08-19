import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { Page } from '@/components/page'
import { type GetCourses200CoursesItem, getCourses } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
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

  useEffect(() => {
    if (!token) navigate({ to: '/' })
  }, [token, navigate])

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

  return (
    <Page className="flex flex-col">
      <div className="flex md:items-center md:gap-0 gap-2 md:justify-between flex-col md:flex-row">
        <h1 className="text-foreground text-lg line-clamp-1 md:text-2xl">
          Olá, {name}
        </h1>
        {courses && courses.length > 0 && (
          <Button
            type="button"
            className="md:w-fit w-full px-3 p-2 mb-0 mt-0 text-base"
            onClick={() => setIsOpen(true)}
          >
            Cadastrar curso
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-foreground">Carregando cursos...</p>
        </div>
      ) : courses?.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-foreground">Você não possui cursos</p>
          <Button
            type="button"
            className="w-fit px-3 p-2"
            onClick={() => setIsOpen(true)}
          >
            Cadastrar curso
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mt-10 md:gap-10 items-center">
          {courses?.map(course => (
            <CourseItem
              key={course.id}
              description={course.description}
              id={course.id}
              title={course.title}
              to="/course/$id"
            />
          ))}
        </div>
      )}

      <Modal onClose={() => setIsOpen(false)} title="Cadastro de curso">
        <CourseCreate reload={handleReload} />
      </Modal>
    </Page>
  )
}
