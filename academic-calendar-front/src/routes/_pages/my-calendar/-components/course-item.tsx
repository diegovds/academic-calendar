import { Link } from '@tanstack/react-router'

type CourseItemProps = {
  id: string
  title: string
  description: string
  to: string
}

export function CourseItem({ description, id, title, to }: CourseItemProps) {
  return (
    <Link
      to={to}
      params={{
        id: id,
      }}
      className="bg-background text-foreground p-4 rounded"
    >
      <h3 className="text-base md:text-lg line-clamp-1">{title}</h3>
      <p className="text-xs md:text-sm line-clamp-3">{description}</p>
    </Link>
  )
}
