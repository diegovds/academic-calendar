import { Page } from '@/components/page'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUpComponent,
})

const formSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'A confirmação de senha é obrigatória'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof formSchema>

function SignUpComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log('Dados enviados:', data)
  }

  return (
    <Page className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-1 w-full md:w-[400px] p-10 mx-4 rounded bg-slate-900 text-slate-100"
      >
        <div>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="border p-2 rounded w-full outline-none bg-slate-100 text-slate-900"
          />
          <p
            className={`${errors.name ? 'opacity-100' : 'opacity-0'} text-red-500 text-sm`}
          >
            {errors.name?.message || '.'}
          </p>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="border p-2 rounded w-full outline-none bg-slate-100 text-slate-900"
          />
          <p
            className={`${errors.email ? 'opacity-100' : 'opacity-0'} text-red-500 text-sm`}
          >
            {errors.email?.message || '.'}
          </p>
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="border p-2 rounded w-full outline-none bg-slate-100 text-slate-900"
          />
          <p
            className={`${errors.password ? 'opacity-100' : 'opacity-0'} text-red-500 text-sm`}
          >
            {errors.password?.message || '.'}
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="border p-2 rounded w-full outline-none bg-slate-100 text-slate-900"
          />
          <p
            className={`${errors.confirmPassword ? 'opacity-100' : 'opacity-0'} text-red-500 text-sm`}
          >
            {errors.confirmPassword?.message || '.'}
          </p>
        </div>

        <button
          type="submit"
          className="bg-green-700 duration-300 hover:bg-green-800 cursor-pointer text-white p-2 rounded w-full mt-2"
          disabled={isSubmitting}
        >
          Cadastrar
        </button>
      </form>
    </Page>
  )
}
