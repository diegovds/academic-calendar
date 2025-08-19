import { Page } from '@/components/page'
import { useAuthStore } from '@/stores/useAuthStore'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

export const Route = createFileRoute('/_pages/my-calendar')({
  component: MyCalendarComponent,
})

function MyCalendarComponent() {
  const navigate = useNavigate()
  const { token, reset } = useAuthStore()

  useEffect(() => {
    if (token === '') {
      navigate({ to: '/' })
    }
  }, [token, navigate])

  return (
    <Page>
      <button
        type="button"
        onClick={() => {
          reset()
          Cookies.remove('token', { path: '/' })
        }}
      >
        sair
      </button>
    </Page>
  )
}
