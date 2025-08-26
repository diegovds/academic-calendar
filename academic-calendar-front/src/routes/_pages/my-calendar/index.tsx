import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import { Page } from '@/components/page'
import { Button } from '@/components/ui/button'
import {
  type GetCourses200CoursesItem,
  type GetTasksNext200TasksItem,
  getCourses,
  getTasksNext,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useDisciplineStore } from '@/stores/useDisciplineStore'
import { useModalStore } from '@/stores/useModalStore'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CourseList } from './-components/course-container'
import { CourseCreate } from './-components/course-create'
import { NextTasks } from './-components/next-tasks'

export const Route = createFileRoute('/_pages/my-calendar/')({
  component: MyCalendarComponent,
  head: () => ({
    meta: [
      {
        name: 'description',
        content:
          'Agenda Acadêmica é uma aplicação desenvolvida para auxiliar estudantes na organização de sua vida acadêmica de forma simples e eficiente.',
      },
      {
        title: 'Minha Dashboard | Agenda Acadêmica',
      },
    ],
  }),
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

  const nextTasksQuery = useQuery<GetTasksNext200TasksItem[]>({
    queryKey: ['next_tasks', token],
    queryFn: async () => {
      const res = await getTasksNext({
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.tasks
    },
    enabled: !!token,
  })

  const { data: nextTasks, isLoading: isLoadingNextTasks } = nextTasksQuery

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

  if (isLoading || !courses || isLoadingNextTasks || !nextTasks)
    return <EmptyMessage text="Carregando..." />

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
        <div className="flex flex-col-reverse md:flex-col">
          {nextTasks.length > 0 && <NextTasks tasks={nextTasks} />}
          <CourseList
            courses={courses}
            setIsOpen={setIsOpen}
            setSelectedCourse={setSelectedCourse}
            parent={parent}
          />
        </div>
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
