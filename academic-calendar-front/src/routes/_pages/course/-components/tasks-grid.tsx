import { Button } from '@/components/button'
import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import {
  type GetDisciplinesDisciplineIdTasks200TasksItem,
  getDisciplinesDisciplineIdTasks,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { formatDate } from '@/utils/format'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TaskCreate } from './task-create'

type TasksGridProps = {
  disciplineId: string
  disciplineName: string
}

export function TasksGrid({ disciplineId, disciplineName }: TasksGridProps) {
  const { token } = useAuthStore()
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
    }
  }

  if (isLoading) return <EmptyMessage text="Carregando disciplina..." />

  return (
    <div className="flex-1 flex flex-col gap-4  rounded">
      <div className="flex justify-between items-center bg-background p-4 rounded">
        <h3 className="text-foreground text-base">{disciplineName}</h3>
        <Button
          type="button"
          className="md:w-fit w-full px-3 p-2 mb-0 mt-0 text-base"
          onClick={() => {
            setIsOpen(true)
            setWhoOpened('task')
          }}
        >
          Adicionar tarefa ou prova
        </Button>
      </div>
      {tasks && (
        <div className="grid grid-cols-2 gap-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-background p-4 rounded text-foreground"
            >
              <h3 className="text-center">{task.title}</h3>
              <div className="flex justify-between">
                <div>{task.type}</div>
                <div>
                  {task.dueDate ? formatDate(new Date(task.dueDate)) : ''}
                </div>
              </div>
              <p className="mt-5 text-justify">{task.description}</p>
            </div>
          ))}
        </div>
      )}

      {whoOpened === 'task' && (
        <Modal
          onClose={() => setIsOpen(false)}
          title="Cadastro de tatefa ou prova"
        >
          <TaskCreate disciplineId={disciplineId} reload={handleReload} />
        </Modal>
      )}
    </div>
  )
}
