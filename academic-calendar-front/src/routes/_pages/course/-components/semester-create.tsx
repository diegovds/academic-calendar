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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { postSemesters } from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'

const SemesterEnum = z.enum(['first', 'second'])
type SemesterType = z.infer<typeof SemesterEnum>

const formSchema = z.object({
  semester: z
    .union([SemesterEnum, z.undefined()])
    .refine((val): val is SemesterType => !!val, {
      message: 'Selecione o semestre',
    }),
})

type FormData = z.infer<typeof formSchema>

type SemesterCreateProps = {
  reload: (reload: boolean) => void
  courseId: string
}

export function SemesterCreate({ courseId, reload }: SemesterCreateProps) {
  const { token } = useAuthStore()
  const { setIsOpen } = useModalStore()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { semester: undefined },
  })

  const onSubmit = async (data: FormData) => {
    if (data.semester) {
      const toastId = toast.loading('Cadastrando...')

      const { semester } = await postSemesters(
        {
          courseId,
          semester: data.semester,
          year: new Date().getFullYear(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
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
