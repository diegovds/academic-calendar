import { create } from 'zustand'

interface TaskState {
  task: string
  setTask: (task: string) => void
  toggleTask: () => void
}

export const useTaskStore = create<TaskState>(set => ({
  task: '',
  setTask: value => set({ task: value }),
  toggleTask: () => set({ task: '' }),
}))
