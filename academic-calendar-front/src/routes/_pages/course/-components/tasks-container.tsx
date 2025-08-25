import { Button } from '@/components/ui/button'
import type { GetDisciplinesDisciplineIdTasks200TasksItem } from '@/http/api'
import { formatDate } from '@/utils/format'
import { ArrowDown, Calendar, Settings2 } from 'lucide-react'
import { type FormHTMLAttributes, forwardRef, useState } from 'react'

type OnTaskSettingsClick = (
  selectedTask: GetDisciplinesDisciplineIdTasks200TasksItem,
  isOpen: boolean,
  whoOpened: string
) => void

type TasksContainerProps = FormHTMLAttributes<HTMLDivElement> & {
  tasks: GetDisciplinesDisciplineIdTasks200TasksItem[]
  onTaskSettingsClick: OnTaskSettingsClick
}

export const TasksContainer = forwardRef<HTMLDivElement, TasksContainerProps>(
  ({ children, className, tasks, onTaskSettingsClick, ...props }, ref) => {
    const [accordion, setAccordion] =
      useState<GetDisciplinesDisciplineIdTasks200TasksItem | null>(null)

    return (
      <div
        ref={ref}
        className="grid md:grid-cols-2 gap-4 items-start"
        {...props}
      >
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex flex-col bg-background shadow p-4 rounded text-foreground"
          >
            <h3 className="text-center text-sm md:text-base">{task.title}</h3>
            <div className="flex justify-between items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.type === 'activity'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {task.type === 'activity' ? 'Tarefa' : 'Prova'}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar size={18} />
                {task.dueDate ? formatDate(new Date(task.dueDate)) : ''}
              </div>
            </div>
            <div className="my-5 flex gap-0.5">
              <p
                className={`flex-1 text-justify text-sm md:text-base tracking-wide ${
                  accordion?.id === task.id
                    ? 'max-h-60 overflow-y-auto'
                    : 'line-clamp-1'
                }`}
              >
                {task.description}
              </p>
              <ArrowDown
                size={20}
                className={`duration-300 ${
                  accordion?.id === task.id ? 'rotate-180' : 'rotate-0'
                }`}
                onClick={() =>
                  setAccordion(
                    accordion && accordion.id === task.id ? null : task
                  )
                }
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="place-self-end"
              onClick={() => {
                onTaskSettingsClick(task, true, 'task')
              }}
            >
              <Settings2 size={20} />
            </Button>
          </div>
        ))}
      </div>
    )
  }
)

TasksContainer.displayName = 'TasksContainer'
