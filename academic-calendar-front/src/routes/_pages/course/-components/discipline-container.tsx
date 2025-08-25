import { Brand } from '@/components/brand'
import { EmptyMessage } from '@/components/empty-message'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import {
  type GetSemestersSemesterIdDisciplines200DisciplinesItem,
  getSemestersSemesterIdDisciplines,
} from '@/http/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useDisciplineStore } from '@/stores/useDisciplineStore'
import { useModalStore } from '@/stores/useModalStore'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Settings2 } from 'lucide-react'
import { useState } from 'react'
import { DisciplineCreate } from './discipline-create'

type DisciplineContainerProps = {
  semesterId: string
}

export function DisciplineContainer({ semesterId }: DisciplineContainerProps) {
  const { token } = useAuthStore()
  const [parent] = useAutoAnimate({ duration: 300 })
  const [selectedDiscipline, setSelectedDiscipline] =
    useState<GetSemestersSemesterIdDisciplines200DisciplinesItem | null>(null)
  const { setDisciplineId, setDisciplineName } = useDisciplineStore()
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
      setSelectedDiscipline(null)
    }
  }

  if (isLoading) return <EmptyMessage text="Carregando disciplinas..." />

  return (
    <div className="w-full md:flex-1 flex flex-col gap-4  rounded">
      <div className="flex justify-between items-center bg-background shadow p-4 rounded">
        <h3 className="text-foreground text-sm md:text-base">Disciplinas</h3>
        <Button
          type="button"
          className="w-fit px-3"
          onClick={() => {
            setIsOpen(true)
            setWhoOpened('discipline')
            setSelectedDiscipline(null)
          }}
        >
          Cadastrar disciplina
        </Button>
      </div>
      {disciplines && (
        <div
          ref={parent}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {disciplines.map(discipline => (
            <div
              key={discipline.id}
              onClick={() => {
                setDisciplineId(discipline.id)
                setDisciplineName(discipline.title)
              }}
              className="p-2 md:p-4 bg-background shadow rounded flex gap-4 items-center cursor-pointer group"
            >
              <div className="flex-1 flex gap-4">
                <Brand />
                <div className="text-sm md:text-base line-clamp-1 cursor-pointer bg-background text-foreground">
                  {discipline.title}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={e => {
                  e.stopPropagation()
                  e.preventDefault()
                  setSelectedDiscipline(discipline)
                  setIsOpen(true)
                  setWhoOpened('discipline')
                }}
              >
                <Settings2 size={20} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {whoOpened === 'discipline' && (
        <Modal
          onClose={() => {
            setIsOpen(false)
            setSelectedDiscipline(null)
          }}
          title={
            selectedDiscipline
              ? 'Edição de disciplina'
              : 'Cadastro de disciplina'
          }
        >
          <DisciplineCreate
            semesterId={semesterId}
            reload={handleReload}
            discipline={selectedDiscipline}
          />
        </Modal>
      )}
    </div>
  )
}
