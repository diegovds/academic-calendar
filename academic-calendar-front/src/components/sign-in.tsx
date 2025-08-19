import { Form } from '@/components/form'
import { FormError } from '@/components/form/form-error'
import { FormInput } from '@/components/form/form-input'
import { FormItem } from '@/components/form/form-item'
import { postSignin } from '@/http/api'
import { sonnerConfig } from '@/libs/sonner'
import { useAuthStore } from '@/stores/useAuthStore'
import type { User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type FormData = z.infer<typeof formSchema>

type SignInProps = {
  formMessage: (formReturn: 'signin' | 'signup') => void
}

export function SignIn({ formMessage }: SignInProps) {
  const { setName, setToken } = useAuthStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const response = await postSignin(data)

    if (response.message) {
      toast(response.message, sonnerConfig)
    }

    if (response.token) {
      const token = response.token
      const cookieExpiresInSeconds = 60 * 60 * 24 * 30

      Cookies.set('token', token, {
        expires: cookieExpiresInSeconds,
        path: '/',
      })

      const user: User = jwtDecode(token)

      setName(user.name)
      setToken(token)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex-1">
      <FormItem>
        <FormInput
          id="email"
          type="email"
          placeholder="E-mail"
          {...register('email')}
        />
        <FormError error={errors.email?.message}>
          {errors.email?.message || '.'}
        </FormError>
      </FormItem>

      <FormItem>
        <FormInput
          id="password"
          type="password"
          placeholder="Senha"
          {...register('password')}
        />
        <FormError error={errors.password?.message}>
          {errors.password?.message || '.'}
        </FormError>
      </FormItem>

      <button
        type="submit"
        className="bg-green-700 duration-300 hover:bg-green-800 cursor-pointer text-white p-2 rounded w-full mt-2 mb-8"
        disabled={isSubmitting}
      >
        Entrar
      </button>

      <FormItem className="flex gap-2 justify-center text-sm">
        <span>Ainda não possui uma conta?</span>
        <button
          type="button"
          onClick={() => formMessage('signup')}
          className="cursor-pointer hover:opacity-90 duration-300 font-medium"
        >
          Clique aqui!
        </button>
      </FormItem>
    </Form>
  )
}
