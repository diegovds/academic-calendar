import type { GetTasksNext200TasksItem } from '@/http/api'
import { formatDate } from '@/utils/format'
import { Fragment } from 'react/jsx-runtime'

interface NextTasksProps {
  tasks: GetTasksNext200TasksItem[]
}

export function NextTasks({ tasks }: NextTasksProps) {
  return (
    <div>
      <h3 className="md:text-xl text-foreground my-4">
        Próximas tarefas ou provas:
      </h3>
      <div className="grid md:grid-cols-2 gap-4 md:gap-10 items-start">
        {tasks.map(course => (
          <div
            key={course.courseId}
            className="bg-secondary text-foreground shadow shadow-gray-300 p-4 rounded space-y-4"
          >
            <h3 className="text-base md:text-lg line-clamp-1">
              {course.courseName}
            </h3>
            {course.disciplines.map(discipline => (
              <div key={discipline.disciplineId} className="mx-4">
                <h4 className="text-sm line-clamp-1">
                  {discipline.disciplineName}
                </h4>
                <div className="grid grid-cols-3 items-center gap-4 text-xs md:text-sm mx-4">
                  {discipline.tasks.map(task => (
                    <Fragment key={task.id}>
                      <div className="font-medium line-clamp-1">
                        {task.title}
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium w-fit place-self-center ${
                          task.type === 'activity'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {task.type === 'activity' ? 'Tarefa' : 'Prova'}
                      </div>
                      <div className="text-muted-foreground text-right">
                        {task.dueDate ? formatDate(new Date(task.dueDate)) : ''}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
