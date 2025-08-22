import { create } from 'zustand'

interface DisciplineState {
  disciplineId: string
  disciplineName: string
  setDisciplineId: (task: string) => void
  setDisciplineName: (task: string) => void
  reset: () => void
}

export const useDisciplineStore = create<DisciplineState>(set => ({
  disciplineId: '',
  disciplineName: '',
  setDisciplineId: value => set({ disciplineId: value }),
  setDisciplineName: value => set({ disciplineName: value }),
  reset: () => set({ disciplineId: '', disciplineName: '' }),
}))
