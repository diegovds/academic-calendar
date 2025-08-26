import { Button } from '@/components/ui/button'
import type { GetDisciplinesDisciplineIdTasks200TasksItem } from '@/http/api'
import { formatDate } from '@/utils/format'
import { ArrowDown, Calendar, Settings2 } from 'lucide-react'
import {
  type Dispatch,
  type FormHTMLAttributes,
  type SetStateAction,
  useRef,
  useState,
} from 'react'

type TasksContainerProps = FormHTMLAttributes<HTMLDivElement> & {
  tasks: GetDisciplinesDisciplineIdTasks200TasksItem[]
  setSelectedTask: Dispatch<
    SetStateAction<GetDisciplinesDisciplineIdTasks200TasksItem | null>
  >
  setIsOpen: (open: boolean) => void
  setWhoOpened: (whoOpened: string) => void
  parent: (element: HTMLElement | null) => void
}

export function TasksContainer({
  children,
  className,
  tasks,
  setIsOpen,
  setSelectedTask,
  setWhoOpened,
  parent,
  ...props
}: TasksContainerProps) {
  const [accordion, setAccordion] =
    useState<GetDisciplinesDisciplineIdTasks200TasksItem | null>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)

  return (
    <div
      ref={parent}
      className={`grid md:grid-cols-2 gap-4 items-start ${className ?? ''}`}
      {...props}
    >
      {tasks.map(task => (
        <div
          key={task.id}
          className="flex flex-col bg-secondary shadow shadow-gray-300 p-4 rounded text-foreground"
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
          <div className="my-5 flex gap-2">
            <p
              ref={accordion?.id === task.id ? paragraphRef : null}
              className={`flex-1 duration-300 text-justify text-sm md:text-base tracking-wide ${
                accordion?.id === task.id
                  ? 'max-h-60 overflow-y-auto'
                  : 'max-h-16 md:max-h-18 overflow-y-hidden'
              }`}
            >
              {task.description}
            </p>
            <ArrowDown
              size={20}
              className={`cursor-pointer duration-300 ${
                accordion?.id === task.id ? 'rotate-180' : 'rotate-0'
              }`}
              onClick={() => {
                if (paragraphRef.current) paragraphRef.current.scrollTop = 0
                setAccordion(
                  accordion && accordion.id === task.id ? null : task
                )
              }}
            />
          </div>
          <Button
            variant="ghost"
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
  )
}
