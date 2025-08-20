import { Button } from '@/components/button'
import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import {
  type GetSemestersSemesterIdDisciplines200DisciplinesItem,
  getSemestersSemesterIdDisciplines,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModalStore } from '@/stores/useModalStore'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DisciplineCreate } from './discipline-create'

type DisciplineContainerProps = {
  semesterId: string
}

export function DisciplineContainer({ semesterId }: DisciplineContainerProps) {
  const { token } = useAuthStore()
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
    <div className="flex-1 flex flex-col gap-4  rounded">
      <div className="flex justify-between items-center bg-background p-4 rounded">
        <h3 className="text-foreground text-base">Disciplinas</h3>
        <Button
          type="button"
          className="md:w-fit w-full px-3 p-2 mb-0 mt-0 text-base"
          onClick={() => {
            setIsOpen(true)
            setWhoOpened('discipline')
          }}
        >
          Cadastrar disciplina
        </Button>
      </div>
      {disciplines && (
        <div className="grid grid-cols-4 gap-4">
          {disciplines.map(discipline => (
            <div
              key={discipline.id}
              className="flex items-center justify-center text-center bg-background p-4 rounded text-foreground"
            >
              {discipline.title}
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
