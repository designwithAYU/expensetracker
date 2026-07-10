import { create } from 'zustand'

export const useToastStore = create((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const t = { id, type: 'info', duration: 3200, ...toast }
    set({ toasts: [...get().toasts, t] })
    setTimeout(() => get().dismiss(id), t.duration)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
}))

export function useToast() {
  const push = useToastStore(s => s.push)
  return {
    success: (message) => push({ type: 'success', message }),
    error: (message) => push({ type: 'error', message }),
    info: (message) => push({ type: 'info', message }),
  }
}
