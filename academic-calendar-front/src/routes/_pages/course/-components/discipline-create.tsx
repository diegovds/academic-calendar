import { Button } from '@/components/button'
import { Form } from '@/components/form'
import { FormError } from '@/components/form/form-error'
import { FormInput } from '@/components/form/form-input'
import { FormItem } from '@/components/form/form-item'
import { postDisciplines } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import z from 'zod'

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
})

type FormData = z.infer<typeof formSchema>

type DiscipleCreateProps = {
  semesterId: string
  reload: (reload: boolean) => void
}

export function DisciplineCreate({ reload, semesterId }: DiscipleCreateProps) {
  const { token } = useAuthStore()
  const { setIsOpen } = useModalStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading('Cadastrando...')

    const { discipline } = await postDisciplines(
      { title: data.title, semesterId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
    <Form onSubmit={handleSubmit(onSubmit)} className="p-0 shadow-none">
      <FormItem>
        <FormInput
          id="name"
          type="text"
          placeholder="Nome"
          {...register('title')}
        />
        <FormError error={errors.title?.message}>
          {errors.title?.message || '.'}
        </FormError>
      </FormItem>

      <Button type="submit" disabled={isSubmitting} className="mb-0 mt-0">
        Cadastrar
      </Button>
    </Form>
  )
}
