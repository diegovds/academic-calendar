import { postCourses } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { getLocalTimeZone, today } from '@internationalized/date'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import z from 'zod'
import { Button } from '../button'
import { Form } from '../form'
import { FormError } from '../form/form-error'
import { FormInput } from '../form/form-input'
import { FormItem } from '../form/form-item'

const formSchema = z.object({
  description: z.string().min(2, {
    message: 'a descrição deve ter pelo menos 2 caracteres',
  }),
  title: z
    .string()
    .min(6, { message: 'o título deve ter pelo menos 6 caracteres' }),
})

type FormData = z.infer<typeof formSchema>

type CourseCreateProps = {
  reload: (reload: boolean) => void
}

export function CourseCreate({ reload }: CourseCreateProps) {
  const { token } = useAuthStore()
  const { month } = today(getLocalTimeZone())
  const { setIsOpen } = useModalStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const { course } = await toast.promise(
      postCourses(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      {
        loading: 'Cadastrando...',
        success: 'Curso cadastrado!',
        error: 'Erro ao cadastrar curso.',
      }
    )

    if (course) {
      setIsOpen(false)
      reload(true)
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

      <FormItem>
        <FormInput
          id="description"
          type="text"
          placeholder="Descrição"
          {...register('description')}
        />
        <FormError error={errors.description?.message}>
          {errors.description?.message || '.'}
        </FormError>
      </FormItem>

      <Button type="submit" disabled={isSubmitting} className="mb-0">
        Cadastrar
      </Button>
    </Form>
  )
}
