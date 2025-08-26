import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { postSignin } from '@/http/api'
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await postSignin(data)

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
        {/* Email */}
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

        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Entrar
        </Button>

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
      </form>
    </Form>
  )
}
