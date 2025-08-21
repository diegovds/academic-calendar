import { Button } from '@/components/button'
import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import {
  type GetSemestersSemesterIdDisciplines200DisciplinesItem,
  getSemestersSemesterIdDisciplines,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DisciplineCreate } from './discipline-create'

type DisciplineContainerProps = {
  semesterId: string
}

export function DisciplineContainer({ semesterId }: DisciplineContainerProps) {
  const { token } = useAuthStore()
  const { setTask, setName } = useTaskStore()
  const { setIsOpen, whoOpened, setWhoOpened, toggleWhoOpened } =
    useModalStore()

  const disciplinesQuery = useQuery<
    GetSemestersSemesterIdDisciplines200DisciplinesItem[]
  >({
    queryKey: ['disciplines', token, semesterId],
    queryFn: async () => {
      const res = await getSemestersSemesterIdDisciplines(semesterId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.disciplines
    },
    enabled: !!token,
  })

  const { data: disciplines, isLoading } = disciplinesQuery

  const queryClient = useQueryClient()

  function handleReload(reload: boolean) {
    if (reload) {
      queryClient.invalidateQueries({
        queryKey: ['disciplines', token, semesterId],
      })
      toggleWhoOpened()
    }
  }

  if (isLoading) return <EmptyMessage text="Carregando disciplinas..." />

  return (
    <div className="w-full md:flex-1 flex flex-col gap-4  rounded">
      <div className="flex justify-between items-center bg-background p-4 rounded">
        <h3 className="text-foreground text-sm md:text-base">Disciplinas</h3>
        <Button
          type="button"
          className="w-fit px-3 p-2 mb-0 mt-0"
          onClick={() => {
            setIsOpen(true)
            setWhoOpened('discipline')
          }}
        >
          Cadastrar disciplina
        </Button>
      </div>
      {disciplines && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {disciplines.map(discipline => (
            <div
              key={discipline.id}
              onClick={() => {
                setTask(discipline.id)
                setName(discipline.title)
              }}
              className="p-2 md:p-4 bg-background flex justify-center cursor-pointer"
            >
              <button
                type="button"
                className="text-sm md:text-base line-clamp-1 cursor-pointer bg-background rounded text-foreground"
              >
                {discipline.title}
              </button>
            </div>
          ))}
        </div>
      )}

      {whoOpened === 'discipline' && (
        <Modal onClose={() => setIsOpen(false)} title="Cadastro de disciplina">
          <DisciplineCreate semesterId={semesterId} reload={handleReload} />
        </Modal>
      )}
    </div>
  )
}
