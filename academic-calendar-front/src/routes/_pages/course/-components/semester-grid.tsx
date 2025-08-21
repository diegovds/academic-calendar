import type { GetCoursesCourseId200CourseAnyOfSemestersItem } from '@/http/api'
import { useTaskStore } from '@/stores/useTaskStore'
import { useState } from 'react'
import { DisciplineContainer } from './discipline-container'
import { TasksGrid } from './tasks-grid'

type SemesterGridProps = {
  semesters: GetCoursesCourseId200CourseAnyOfSemestersItem[]
}

export function SemesterGrid({ semesters }: SemesterGridProps) {
  const [selectedSemester, setSelectedSemester] = useState<string | null>(
    semesters ? semesters[0].id : null
  )
  const { task, reset, name } = useTaskStore()

  return (
    <div className="flex gap-6 items-start md:flex-row flex-col">
      <div className="flex md:flex-col gap-4 w-full md:w-fit p-0.5 md:p-0 overflow-x-auto md:overflow-x-visible">
        {semesters.map(semester => (
          <button
            type="button"
            onClick={() => {
              setSelectedSemester(semester.id)
              reset()
            }}
            key={semester.id}
            className={`text-sm md:text-base text-nowrap bg-background shadow text-foreground px-4 py-2 md:py-6 rounded cursor-pointer duration-300 hover:opacity-80 ${selectedSemester === semester.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            {semester.year}
            {semester.semester === 'first' ? ' / 1' : ' / 2'}
          </button>
        ))}
      </div>
      {selectedSemester && task === '' && (
        <DisciplineContainer semesterId={selectedSemester} />
      )}

      {task !== '' && <TasksGrid disciplineId={task} disciplineName={name} />}
    </div>
  )
}
