import { Brand } from '@/components/brand'
import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import { Page } from '@/components/page'
import { Button } from '@/components/ui/button'
import { type GetCourses200CoursesItem, getCourses } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useDisciplineStore } from '@/stores/useDisciplineStore'
import { useModalStore } from '@/stores/useModalStore'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Settings2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CourseCreate } from './-components/course-create'

export const Route = createFileRoute('/_pages/my-calendar/')({
  component: MyCalendarComponent,
})

function MyCalendarComponent() {
  const navigate = useNavigate()
  const [parent] = useAutoAnimate({ duration: 300 })
  const { token, name } = useAuthStore()
  const { setIsOpen } = useModalStore()
  const { reset } = useDisciplineStore()
  const [selectedCourse, setSelectedCourse] =
    useState<GetCourses200CoursesItem | null>(null)

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
      setSelectedCourse(null)
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
          <div
            ref={parent}
            className="grid md:grid-cols-2 gap-4 md:gap-10 items-center"
          >
            {courses.map(course => (
              <Link
                key={course.id}
                to="/course/$id"
                params={{
                  id: course.id,
                }}
                className="bg-background text-foreground shadow p-4 rounded flex items-center gap-4 group"
              >
                <Button
                  variant="default"
                  size="icon"
                  className="w-fit p-0"
                  onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    setSelectedCourse(course)
                    setIsOpen(true)
                  }}
                >
                  <Settings2 size={20} />
                </Button>
                <div className="flex-1 flex justify-between">
                  <div>
                    <h3 className="text-base md:text-lg line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs md:text-sm line-clamp-3">
                      {course.description}
                    </p>
                  </div>
                  <Brand />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <Modal
        onClose={() => {
          setIsOpen(false)
          setSelectedCourse(null)
        }}
        title={selectedCourse ? 'Edição de curso' : 'Cadastro de curso'}
      >
        <CourseCreate reload={handleReload} course={selectedCourse} />
      </Modal>
    </Page>
  )
}
