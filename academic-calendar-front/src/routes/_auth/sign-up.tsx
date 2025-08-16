import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sign-up')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: 'description',
        content: 'My App is a web application',
      },
      {
        title: 'My App',
      },
    ],
  }),
})

function RouteComponent() {
  return <div>Hello "/_auth/signup"!</div>
}
