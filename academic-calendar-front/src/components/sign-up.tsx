import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { postSignup } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import type { User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'A confirmação de senha é obrigatória'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof formSchema>

type SignUpProps = {
  formMessage: (formReturn: 'signin' | 'signup') => void
}

export function SignUp({ formMessage }: SignUpProps) {
  const { setName, setToken } = useAuthStore()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await postSignup(data)

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
    } catch (error: unknown) {
      toast.error((error as Error).message)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full px-5 py-7 md:p-10 rounded bg-secondary shadow shadow-gray-300 text-foreground"
      >
        {/* Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="E-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Senha */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirmação de senha */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Senha novamente"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Cadastrar
        </Button>

        <FormItem className="flex gap-2 justify-center text-sm">
          <span>Já possui uma conta?</span>
          <button
            type="button"
            onClick={() => formMessage('signin')}
            className="cursor-pointer hover:opacity-90 duration-300 font-medium"
          >
            Clique aqui!
          </button>
        </FormItem>
      </form>
    </Form>
  )
}
