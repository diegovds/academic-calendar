import type { QueryClient } from '@tanstack/react-query'

import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { TanstackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <HeadContent />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex min-h-dvh flex-col bg-background">
          <Outlet />
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: 'Outfit, sans-serif',
                fontSize: '15px',
              },
            }}
            richColors
          />
          {import.meta.env.DEV && (
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
          )}
        </div>
      </ThemeProvider>
    </>
  ),
})
