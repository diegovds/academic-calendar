import { create } from 'zustand'

interface TaskState {
  task: string
  name: string
  setTask: (task: string) => void
  setName: (task: string) => void
  reset: () => void
}

export const useTaskStore = create<TaskState>(set => ({
  task: '',
  name: '',
  setTask: value => set({ task: value }),
  setName: value => set({ name: value }),
  reset: () => set({ task: '', name: '' }),
}))
