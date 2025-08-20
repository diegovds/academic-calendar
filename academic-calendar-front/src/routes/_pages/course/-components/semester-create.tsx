import { Button } from '@/components/button'
import { Form } from '@/components/form'
import { FormError } from '@/components/form/form-error'
import { FormInput } from '@/components/form/form-input'
import { FormItem } from '@/components/form/form-item'
import { postSemesters } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import z from 'zod'

const formSchema = z
  .object({
    semester: z.enum(['first', 'second']).optional(),
  })
  .refine(data => !!data.semester, {
    message: 'Selecione o semestre',
    path: ['semester'],
  })

type FormData = z.infer<typeof formSchema>

type SemesterCreateProps = {
  reload: (reload: boolean) => void
  courseId: string
}

export function SemesterCreate({ courseId, reload }: SemesterCreateProps) {
  const { token } = useAuthStore()
  const { setIsOpen } = useModalStore()
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const selectedSemester = watch('semester')

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading('Cadastrando...')
    if (data.semester) {
      const { semester } = await postSemesters(
        {
          courseId,
          semester: data.semester,
          year: new Date().getFullYear(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.dismiss(toastId)

      if (semester) {
        toast.success('Semestre cadastrado!')
        setIsOpen(false)
        reload(true)
      } else {
        toast.error('Erro ao cadastrar semestre.')
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-0 shadow-none">
      <div className="flex flex-col">
        <div className="flex gap-6">
          <FormItem className="space-x-2 flex items-center">
            <FormInput
              id="first"
              type="checkbox"
              checked={selectedSemester === 'first'}
              onChange={() =>
                setValue(
                  'semester',
                  selectedSemester === 'first' ? undefined : 'first',
                  { shouldValidate: true }
                )
              }
              className="w-fit shadow-none"
            />
            <label className="text-sm" htmlFor="first">
              1º semestre
            </label>
          </FormItem>

          <FormItem className="space-x-2 flex items-center">
            <FormInput
              id="second"
              type="checkbox"
              checked={selectedSemester === 'second'}
              onChange={() =>
                setValue(
                  'semester',
                  selectedSemester === 'second' ? undefined : 'second',
                  { shouldValidate: true }
                )
              }
              className="w-fit shadow-none"
            />
            <label className="text-sm" htmlFor="second">
              2º semestre
            </label>
          </FormItem>
        </div>
        <FormError error={errors.semester?.message}>
          {errors.semester?.message || '.'}
        </FormError>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mb-0 mt-0">
        Cadastrar
      </Button>
    </Form>
  )
}
