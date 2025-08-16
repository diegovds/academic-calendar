import { Link } from '@tanstack/react-router'

export default function Navbar() {
  return (
    <header className="container mx-auto p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
        <div className="px-2 font-bold">
          <Link to="/sign-up">Cadastro</Link>
        </div>
        <div className="px-2 font-bold">
          <Link to="/my-calendar">Meu calendario</Link>
        </div>
      </nav>
    </header>
  )
}
