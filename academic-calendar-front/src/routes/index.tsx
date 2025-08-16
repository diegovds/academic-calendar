import { Page } from '@/components/page'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <Page className="flex gap-8 items-center justify-center flex-col">
      <h1>
        Cupidatat elit nostrud ad consectetur. Do ex nisi ad non adipisicing
        fugiat adipisicing elit esse tempor Lorem reprehenderit excepteur nisi.
      </h1>
      <p>
        In adipisicing officia sint laboris commodo mollit ipsum consequat sunt
        aliqua. Non aliqua id est sit sunt occaecat nisi. Et tempor mollit
        deserunt officia. Consequat id consequat consequat duis ex fugiat
        labore. Excepteur nostrud mollit tempor reprehenderit dolor. Id
        consectetur velit deserunt sit. Laboris amet nostrud dolore dolor.
        Officia dolor dolore ad fugiat et voluptate tempor cillum consequat
        consectetur ut sunt. Cillum laborum commodo sunt consectetur est
        excepteur fugiat. Irure magna ea velit do aliqua anim. Commodo velit
        occaecat adipisicing non. Non et ipsum sint pariatur qui deserunt ad
        duis nulla fugiat et irure et aliqua.
      </p>
      <Link to="/my-calendar">Entrar</Link>
    </Page>
  )
}
