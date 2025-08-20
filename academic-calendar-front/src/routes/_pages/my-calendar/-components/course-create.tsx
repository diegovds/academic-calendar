import { Button } from '@/components/button'
import { Form } from '@/components/form'
import { FormError } from '@/components/form/form-error'
import { FormInput } from '@/components/form/form-input'
import { FormItem } from '@/components/form/form-item'
import { postCourses, postSemesters } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import z from 'zod'

const formSchema = z
  .object({
    description: z.string().min(2, {
      message: 'A descrição deve ter pelo menos 2 caracteres',
    }),
    title: z
      .string()
      .min(6, { message: 'O título deve ter pelo menos 6 caracteres' }),
    semester: z.enum(['first', 'second']).optional(),
  })
  .refine(data => !!data.semester, {
    message: 'Selecione o semestre',
    path: ['semester'],
  })

type FormData = z.infer<typeof formSchema>

type CourseCreateProps = {
  reload: (reload: boolean) => void
}

export function CourseCreate({ reload }: CourseCreateProps) {
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

  const selectedSemester = watch('semester')

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

    if (data.semester) {
      await postSemesters(
        {
          courseId: course.id,
          semester: data.semester,
          year: 2025,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    }

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
