import type { GetCoursesCourseId200CourseAnyOfSemestersItem } from '@/http/api'
import { useState } from 'react'
import { DisciplineContainer } from './discipline-container'

type SemesterGridProps = {
  semesters: GetCoursesCourseId200CourseAnyOfSemestersItem[]
}

export function SemesterGrid({ semesters }: SemesterGridProps) {
  const [selectedSemester, setSelectedSemester] = useState<string | null>(
    semesters ? semesters[semesters.length - 1].id : null
  )

  return (
    <div className="flex gap-6 items-start">
      <div className="w-40 flex flex-col gap-4">
        {semesters.map(semester => (
          <button
            type="button"
            onClick={() => setSelectedSemester(semester.id)}
            key={semester.id}
            className={`bg-background text-foreground p-4 rounded cursor-pointer duration-300 hover:opacity-80 ${selectedSemester === semester.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            {semester.year}
            {semester.semester === 'first' ? ' / 1' : ' / 2'}
          </button>
        ))}
      </div>
      {selectedSemester && (
        <DisciplineContainer semesterId={selectedSemester} />
      )}
    </div>
  )
}
