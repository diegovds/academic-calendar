import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex-1 bg-black text-white items-center justify-center flex flex-col">
      <h1>Título</h1>
      <p>Texto</p>
    </div>
  )
}
