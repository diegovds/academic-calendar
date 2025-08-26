import { useAuthStore } from '@/stores/useAuthStore'
import { Link } from '@tanstack/react-router'
import Cookies from 'js-cookie'
import { HiAcademicCap } from 'react-icons/hi2'

export default function Navbar() {
  const { reset } = useAuthStore()

  return (
    <nav className="bg-secondary shadow shadow-gray-300 py-3 md:py-4">
      <div className="container mx-auto px-4 md:px-10 flex flex-row items-center justify-between">
        <Link
          to="/my-calendar"
          className="flex gap-2 items-center w-fit bg-blue-500 text-sm md:text-base text-white p-2 md:p-2.5 rounded-4xl"
        >
          <HiAcademicCap size={25} />
          <h1>Agenda Acadêmica</h1>
        </Link>

        <div className="flex gap-4">
          <div className="font-semibold text-sm md:text-base">
            <Link to="/my-calendar">Minha dashboard</Link>
          </div>

          <div className="font-semibold text-sm md:text-base">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                reset()
                Cookies.remove('token', { path: '/' })
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
