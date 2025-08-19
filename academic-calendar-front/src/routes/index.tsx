import { Page } from '@/components/page'
import { SignIn } from '@/components/sign-in'
import { SignUp } from '@/components/sign-up'
import { useAuthStore } from '@/stores/useAuthStore'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { HiAcademicCap } from 'react-icons/hi2'
import { LiaBookSolid } from 'react-icons/lia'
import { PiStudentFill } from 'react-icons/pi'

export const Route = createFileRoute('/')({
  component: Homepage,
})

function Homepage() {
  const [form, setForm] = useState<'signin' | 'signup'>('signin')
  const navigate = useNavigate()
  const { token } = useAuthStore()

  useEffect(() => {
    if (token !== '') {
      navigate({ to: '/my-calendar' })
    }
  }, [token, navigate])

  function handleForm(formReturn: 'signin' | 'signup') {
    setForm(formReturn === 'signin' ? 'signin' : 'signup')
  }

  return (
    <Page className="flex items-center px-4 md:px-10 gap-8 flex-col md:flex-row">
      <div className="flex-1 rounded text-foreground  space-y-5">
        <div className="flex gap-2 items-center text-blue-500">
          <HiAcademicCap size={52} />
          <h1 className="text-4xl">Agenda Acadêmica</h1>
        </div>
        <div className="space-y-5 text-base">
          <p className="text-foreground">
            Agenda Acadêmica é uma aplicação desenvolvida para auxiliar
            estudantes na organização de sua vida acadêmica de forma simples e
            eficiente.
          </p>
          <div className="flex gap-6 flex-col md:flex-row">
            <div className="flex flex-1 flex-col-reverse p-4 gap-4 rounded bg-background shadow shadow-gray-300">
              <p className="text-foreground text-sm text-center">
                Cadastre seus cursos, semestres, disciplinas e não perca nenhum
                trabalho ou prova.
              </p>
              <div className="bg-blue-200 w-fit place-self-center p-2.5 rounded-full">
                <LiaBookSolid size={32} className="text-blue-600" />
              </div>
            </div>
            <div className="flex flex-1 flex-col-reverse p-4 gap-4 rounded bg-background shadow shadow-gray-300">
              <p className="text-foreground text-sm text-center">
                Você tem tudo em um só lugar para estudar com mais foco e menos
                estresse.
              </p>
              <div className="bg-blue-200 w-fit place-self-center p-2.5 rounded-full">
                <PiStudentFill size={32} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[450px]">
        {form === 'signin' ? (
          <SignIn formMessage={handleForm} />
        ) : (
          <SignUp formMessage={handleForm} />
        )}
      </div>
    </Page>
  )
}
