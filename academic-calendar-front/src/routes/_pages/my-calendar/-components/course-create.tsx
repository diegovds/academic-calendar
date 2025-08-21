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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

import { postCourses, postSemesters } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'

const SemesterEnum = z.enum(['first', 'second'])
type SemesterType = z.infer<typeof SemesterEnum>

const formSchema = z.object({
  title: z
    .string()
    .min(6, { message: 'O título deve ter pelo menos 6 caracteres' }),
  description: z
    .string()
    .min(2, { message: 'A descrição deve ter pelo menos 2 caracteres' }),
  semester: z
    .union([SemesterEnum, z.undefined()])
    .refine((val): val is SemesterType => !!val, {
      message: 'Selecione o semestre',
    }),
})

type FormData = z.infer<typeof formSchema>

type CourseCreateProps = {
  reload: (reload: boolean) => void
}

export function CourseCreate({ reload }: CourseCreateProps) {
  const { token } = useAuthStore()
  const { setIsOpen } = useModalStore()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      semester: undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading('Cadastrando...')

    const { course } = await postCourses(data, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (data.semester && course) {
      await postSemesters(
        {
          courseId: course.id,
          semester: data.semester,
          year: new Date().getFullYear(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    }

    toast.dismiss(toastId)

    if (course) {
      toast.success('Curso cadastrado!')
      setIsOpen(false)
      reload(true)
    } else {
      toast.error('Erro ao cadastrar curso.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Título */}
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

        {/* Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Descrição"
                  className="resize-none h-30"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Semestre */}
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semestre</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex flex-row gap-6"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="first" />
                    </FormControl>
                    <FormLabel>1º semestre</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="second" />
                    </FormControl>
                    <FormLabel>2º semestre</FormLabel>
                  </FormItem>
                </RadioGroup>
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
