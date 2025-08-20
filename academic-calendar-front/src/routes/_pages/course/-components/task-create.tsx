import { Button } from '@/components/button'
import { Form } from '@/components/form'
import { FormError } from '@/components/form/form-error'
import { FormInput } from '@/components/form/form-input'
import { FormItem } from '@/components/form/form-item'
import { postTasks } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const formSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: 'O título precisa ter no mínimo 3 caracteres' }),
    description: z
      .string()
      .min(5, { message: 'A descrição precisa ter no mínimo 5 caracteres' }),
    dueDate: z.string().min(1, { message: 'Data é obrigatória' }), // obrigatório, mas string
    type: z.enum(['exam', 'activity']).optional(),
  })
  .refine(data => !!data.type, {
    message: 'Selecione prova ou tarefa',
    path: ['type'],
  })

type FormData = z.infer<typeof formSchema>

type TaskCreateProps = {
  reload: (reload: boolean) => void
  disciplineId: string
}

export function TaskCreate({ reload, disciplineId }: TaskCreateProps) {
  const { token } = useAuthStore()
  const { setIsOpen } = useModalStore()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const selectedType = watch('type')

  const onSubmit = async (data: FormData) => {
    if (data.type) {
      const toastId = toast.loading('Cadastrando...')
      const dueDate = new Date(data.dueDate)

      if (Number.isNaN(dueDate.getTime())) {
        toast.dismiss(toastId)
        toast.error('Erro ao cadastrar tarefa.')
        return
      }

      const { task } = await postTasks(
        {
          disciplineId,
          title: data.title,
          description: data.description,
          dueDate,
          type: data.type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast.dismiss(toastId)

      if (task) {
        toast.success('Tarefa cadastrada!')
        setIsOpen(false)
        reload(true)
      } else {
        toast.error('Erro ao cadastrar tarefa.')
      }
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
        <textarea
          id="description"
          className="p-2 rounded w-full outline-none bg-[#f3f4f8] text-foreground shadow shadow-gray-300 resize-none h-30"
          placeholder="Descrição"
          {...register('description')}
        />
        <FormError error={errors.description?.message}>
          {errors.description?.message || '.'}
        </FormError>
      </FormItem>

      <FormItem>
        <FormInput
          id="date"
          type="date"
          placeholder="Data"
          {...register('dueDate')}
        />
        <FormError error={errors.dueDate?.message}>
          {errors.dueDate?.message || '.'}
        </FormError>
      </FormItem>

      <div className="flex flex-col">
        <div className="flex gap-6">
          <FormItem className="space-x-2 flex items-center">
            <FormInput
              id="activity"
              type="checkbox"
              checked={selectedType === 'activity'}
              onChange={() =>
                setValue(
                  'type',
                  selectedType === 'activity' ? undefined : 'activity',
                  { shouldValidate: true }
                )
              }
              className="w-fit shadow-none"
            />
            <label className="text-sm" htmlFor="activity">
              Tarefa
            </label>
          </FormItem>

          <FormItem className="space-x-2 flex items-center">
            <FormInput
              id="exam"
              type="checkbox"
              checked={selectedType === 'exam'}
              onChange={() =>
                setValue('type', selectedType === 'exam' ? undefined : 'exam', {
                  shouldValidate: true,
                })
              }
              className="w-fit shadow-none"
            />
            <label className="text-sm" htmlFor="exam">
              Prova
            </label>
          </FormItem>
        </div>
        <FormError error={errors.type?.message}>
          {errors.type?.message || '.'}
        </FormError>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mb-0 mt-0">
        Cadastrar
      </Button>
    </Form>
  )
}
