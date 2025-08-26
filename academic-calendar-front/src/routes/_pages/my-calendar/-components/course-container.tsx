import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import type { GetCourses200CoursesItem } from '@/http/api'
import { Link } from '@tanstack/react-router'
import { Settings2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

interface CourseListProps {
  courses: GetCourses200CoursesItem[]
  setIsOpen: (open: boolean) => void
  setSelectedCourse: Dispatch<SetStateAction<GetCourses200CoursesItem | null>>
  parent: (element: HTMLElement | null) => void
}

export function CourseList({
  courses,
  setIsOpen,
  setSelectedCourse,
  parent,
}: CourseListProps) {
  return (
    <div>
      <h3 className="md:text-xl text-foreground my-4">Cursos:</h3>
      <div
        ref={parent}
        className="grid md:grid-cols-2 gap-4 md:gap-10 items-center"
      >
        {courses.map(course => (
          <Link
            key={course.id}
            to="/course/$id"
            params={{ id: course.id }}
            className="bg-background text-foreground shadow p-4 rounded flex items-center gap-4 group"
          >
            <div className="flex-1 flex gap-4">
              <Brand />
              <div>
                <h3 className="text-base md:text-lg line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs md:text-sm line-clamp-3 text-muted-foreground">
                  {course.description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={e => {
                e.stopPropagation()
                e.preventDefault()
                setSelectedCourse(course)
                setIsOpen(true)
              }}
            >
              <Settings2 size={20} />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
