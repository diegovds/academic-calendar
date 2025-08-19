import { useAuthStore } from '@/stores/useAuthStore'
import { Link } from '@tanstack/react-router'
import Cookies from 'js-cookie'

export default function Navbar() {
  const { reset } = useAuthStore()

  return (
    <header className="container mx-auto p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/my-calendar">Meu calendario</Link>
        </div>

        <div className="px-2 font-bold">
          <button
            type="button"
            onClick={() => {
              reset()
              Cookies.remove('token', { path: '/' })
            }}
          >
            Sair
          </button>
        </div>
      </nav>
    </header>
  )
}
