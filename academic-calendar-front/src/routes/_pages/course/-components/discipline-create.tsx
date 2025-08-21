import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { postDisciplines } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
})

type FormData = z.infer<typeof formSchema>

type DisciplineCreateProps = {
  semesterId: string
  reload: (reload: boolean) => void
}

export function DisciplineCreate({
  reload,
  semesterId,
}: DisciplineCreateProps) {
  const { token } = useAuthStore()
  const { setIsOpen } = useModalStore()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  })

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading('Cadastrando...')

    const { discipline } = await postDisciplines(
      { title: data.title, semesterId },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    toast.dismiss(toastId)

    if (discipline) {
      toast.success('Disciplina cadastrada!')
      setIsOpen(false)
      reload(true)
    } else {
      toast.error('Erro ao cadastrar disciplina.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da disciplina</FormLabel>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Cadastrar
        </Button>
      </form>
    </Form>
  )
}
