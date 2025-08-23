import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import {
  type GetDisciplinesDisciplineIdTasks200TasksItem,
  getDisciplinesDisciplineIdTasks,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { formatDate } from '@/utils/format'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, FilePenLine, NotebookPen, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { TaskCreate } from './task-create'

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
      <div className="flex justify-between items-center bg-background shadow p-4 rounded">
        <h3 className="text-foreground text-sm md:text-base">
          {disciplineName}
        </h3>
        <Button
          type="button"
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
        <div ref={parent} className="grid md:grid-cols-2 gap-4 items-start">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex flex-col bg-background shadow p-4 rounded text-foreground"
            >
              <h3 className="text-center text-sm md:text-base">{task.title}</h3>
              <div className="flex justify-between items-center">
                <div
                  className={`flex gap-1 items-center p-1 rounded font-semibold text-sm ${task.type === 'activity' ? 'bg-blue-200' : 'bg-yellow-200'}`}
                >
                  {task.type === 'activity' ? (
                    <>
                      <NotebookPen size={20} />
                      Tarefa
                    </>
                  ) : (
                    <>
                      <FilePenLine size={20} />
                      Prova
                    </>
                  )}
                </div>
                <div className="flex gap-1 items-center text-sm md:text-base">
                  <CalendarDays size={22} />
                  {task.dueDate ? formatDate(new Date(task.dueDate)) : ''}
                </div>
              </div>
              <p className="my-5 text-justify max-h-60 overflow-y-auto text-sm md:text-base tracking-wide">
                {task.description}
              </p>
              <Button
                variant="default"
                size="icon"
                className="place-self-end"
                onClick={() => {
                  setSelectedTask(task)
                  setIsOpen(true)
                  setWhoOpened('task')
                }}
              >
                <Settings2 size={20} />
              </Button>
            </div>
          ))}
        </div>
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
