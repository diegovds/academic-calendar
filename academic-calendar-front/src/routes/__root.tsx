import type { QueryClient } from '@tanstack/react-query'

import { TanstackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="flex min-h-dvh flex-col">
      <Outlet />
      <Toaster position="top-center" richColors />
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </div>
  ),
})
