import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import {
  type GetDisciplinesDisciplineIdTasks200TasksItem,
  getDisciplinesDisciplineIdTasks,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { TaskCreate } from './task-create'
import { TasksContainer } from './tasks-container'

type TasksGridProps = {
  disciplineId: string
  disciplineName: string
}

export function TasksGrid({ disciplineId, disciplineName }: TasksGridProps) {
  const { token } = useAuthStore()
  const [parent] = useAutoAnimate({ duration: 300 })
  const [selectedTask, setSelectedTask] =
    useState<GetDisciplinesDisciplineIdTasks200TasksItem | null>(null)
  const { setIsOpen, setWhoOpened, whoOpened, toggleWhoOpened } =
    useModalStore()

  const tasksQuery = useQuery<GetDisciplinesDisciplineIdTasks200TasksItem[]>({
    queryKey: ['tasks', token, disciplineId],
    queryFn: async () => {
      const res = await getDisciplinesDisciplineIdTasks(disciplineId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.tasks
    },
    enabled: !!token,
  })

  const { data: tasks, isLoading } = tasksQuery

  const queryClient = useQueryClient()

  function handleReload(reload: boolean) {
    if (reload) {
      queryClient.invalidateQueries({
        queryKey: ['tasks', token, disciplineId],
      })
      toggleWhoOpened()
      setSelectedTask(null)
    }
  }

  if (isLoading) return <EmptyMessage text="Carregando disciplina..." />

  return (
    <div className="w-full md:flex-1 flex flex-col gap-4  rounded">
      <div className="flex justify-between items-center bg-secondary shadow shadow-gray-300 p-4 rounded">
        <h3 className="text-foreground text-sm md:text-base">
          {disciplineName}
        </h3>
        <Button
          type="button"
          variant="default"
          className="w-fit px-3"
          onClick={() => {
            setIsOpen(true)
            setSelectedTask(null)
            setWhoOpened('task')
          }}
        >
          Adicionar tarefa ou prova
        </Button>
      </div>
      {tasks && (
        <TasksContainer
          tasks={tasks}
          setSelectedTask={setSelectedTask}
          setIsOpen={setIsOpen}
          setWhoOpened={setWhoOpened}
          parent={parent}
        />
      )}

      {whoOpened === 'task' && (
        <Modal
          onClose={() => setIsOpen(false)}
          title={
            selectedTask === null
              ? 'Cadastro de tatefa ou prova'
              : selectedTask.type === 'activity'
                ? 'Edição de tarefa'
                : 'Edição de prova'
          }
        >
          <TaskCreate
            disciplineId={disciplineId}
            reload={handleReload}
            task={selectedTask}
          />
        </Modal>
      )}
    </div>
  )
}
