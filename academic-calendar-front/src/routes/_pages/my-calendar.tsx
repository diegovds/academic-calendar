import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { CourseCreate } from '@/components/my-calendar/course-create'
import { Page } from '@/components/page'
import { type GetCourses200CoursesItem, getCourses } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_pages/my-calendar')({
  component: MyCalendarComponent,
})

function MyCalendarComponent() {
  const navigate = useNavigate()
  const { token, name } = useAuthStore()
  const { setIsOpen } = useModalStore()

  // redireciona se não houver token
  if (!token) {
    navigate({ to: '/' })
  }

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
      <div>
        <h1 className="text-foreground">Olá, {name}</h1>
      </div>

      {isLoading ? (
        <p>Carregando cursos...</p>
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
        <div>
          {courses?.map(course => (
            <div key={course.id}>{course.title}</div>
          ))}
        </div>
      )}

      <Modal onClose={() => setIsOpen(false)} title="Cadastro de curso">
        <CourseCreate reload={handleReload} />
      </Modal>
    </Page>
  )
}
