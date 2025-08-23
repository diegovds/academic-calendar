import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

import {
  type GetDisciplinesDisciplineIdTasks200TasksItem,
  postTasks,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'

const TaskEnum = z.enum(['exam', 'activity'])
type TaskType = z.infer<typeof TaskEnum>

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'O título precisa ter no mínimo 3 caracteres' }),
  description: z
    .string()
    .min(5, { message: 'A descrição precisa ter no mínimo 5 caracteres' }),
  dueDate: z
    .union([z.date(), z.undefined()])
    .refine(val => val instanceof Date, { message: 'A data é obrigatória' }),
  type: z
    .union([TaskEnum, z.undefined()])
    .refine((val): val is TaskType => !!val, {
      message: 'Selecione prova ou tarefa',
    }),
})

type FormData = z.infer<typeof formSchema>

type TaskCreateProps = {
  reload: (reload: boolean) => void
  disciplineId: string
  task: GetDisciplinesDisciplineIdTasks200TasksItem | null
}

export function TaskCreate({ reload, disciplineId, task }: TaskCreateProps) {
  const { token } = useAuthStore()
  const { setIsOpen } = useModalStore()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task ? task.title : '',
      description: task ? task.description : '',
      dueDate:
        task && typeof task.dueDate === 'string'
          ? new Date(task.dueDate)
          : undefined,
      type: task ? task.type : undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    if (data.type && !task) {
      const toastId = toast.loading('Cadastrando...')

      const { task } = await postTasks(
        {
          disciplineId,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          type: data.type,
        },
        { headers: { Authorization: `Bearer ${token}` } }
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

    if (data.type && task) {
      const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()

      if (form.formState.defaultValues?.dueDate && data.dueDate) {
        const update =
          form.formState.defaultValues?.title !== data.title ||
          form.formState.defaultValues?.description !== data.description ||
          form.formState.defaultValues?.type !== data.type ||
          !isSameDay(form.formState.defaultValues.dueDate, data.dueDate)

        // se update faça o update
      }
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

        {/* Data */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-[280px] justify-start text-left font-normal ${
                        !field.value && 'text-muted-foreground'
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                      ) : (
                        <span>Data</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo (Radio) */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="activity" id="activity" />
                    <FormLabel
                      htmlFor="activity"
                      className="text-sm font-normal"
                    >
                      Tarefa
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exam" id="exam" />
                    <FormLabel htmlFor="exam" className="text-sm font-normal">
                      Prova
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {task ? 'Editar' : 'Adicionar'}
        </Button>
      </form>
    </Form>
  )
}
