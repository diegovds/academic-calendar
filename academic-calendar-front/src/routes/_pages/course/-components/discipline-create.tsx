import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  type GetSemestersSemesterIdDisciplines200DisciplinesItem,
  postDisciplines,
  putDisciplinesDisciplineId,
} from '@/http/api'
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
  discipline: GetSemestersSemesterIdDisciplines200DisciplinesItem | null
}

export function DisciplineCreate({
  reload,
  semesterId,
  discipline,
}: DisciplineCreateProps) {
  const { token } = useAuthStore()
  const { setIsOpen } = useModalStore()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: discipline ? discipline.title : '' },
  })

  const onSubmit = async (data: FormData) => {
    if (!discipline) {
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
    } else if (form.formState.defaultValues?.title !== data.title) {
      const toastId = toast.loading('Atualizando...')

      const { success } = await putDisciplinesDisciplineId(
        discipline.id,
        { title: data.title },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.dismiss(toastId)

      if (success) {
        toast.success('Disciplina atualizada!')
        setIsOpen(false)
        reload(true)
      } else {
        toast.error('Erro ao atualizar disciplina.')
      }
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
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {discipline ? 'Editar' : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  )
}
