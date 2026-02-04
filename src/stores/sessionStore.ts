import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SessionState, SessionProgress } from '@/types'

interface SessionStoreState {
  // État
  currentSession: SessionProgress | null
  completedSessionIds: string[]
  
  // Actions
  startSession: (sessionId: string) => void
  setStep: (step: SessionState) => void
  advanceStep: () => void
  addAudioChunk: (chunk: Blob) => void
  completeSession: () => void
  resetCurrentSession: () => void
  isSessionCompleted: (sessionId: string) => boolean
  resetAllProgress: () => void
}

const stepOrder: SessionState[] = ['intro', 'exercise', 'debrief', 'anchor', 'complete']

export const useSessionStore = create<SessionStoreState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      completedSessionIds: [],

      startSession: (sessionId: string) => {
        set({
          currentSession: {
            currentSessionId: sessionId,
            currentStep: 'intro',
            audioChunks: [],
            startedAt: new Date(),
          }
        })
      },

      setStep: (step: SessionState) => {
        const { currentSession } = get()
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              currentStep: step,
            }
          })
        }
      },

      advanceStep: () => {
        const { currentSession } = get()
        if (currentSession) {
          const currentIndex = stepOrder.indexOf(currentSession.currentStep)
          const nextIndex = Math.min(currentIndex + 1, stepOrder.length - 1)
          set({
            currentSession: {
              ...currentSession,
              currentStep: stepOrder[nextIndex],
            }
          })
        }
      },

      addAudioChunk: (chunk: Blob) => {
        const { currentSession } = get()
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              audioChunks: [...currentSession.audioChunks, chunk],
            }
          })
        }
      },

      completeSession: () => {
        const { currentSession, completedSessionIds } = get()
        if (currentSession?.currentSessionId) {
          const newCompletedIds = completedSessionIds.includes(currentSession.currentSessionId)
            ? completedSessionIds
            : [...completedSessionIds, currentSession.currentSessionId]
          set({
            completedSessionIds: newCompletedIds,
            currentSession: {
              ...currentSession,
              currentStep: 'complete',
            }
          })
        }
      },

      resetCurrentSession: () => {
        set({ currentSession: null })
      },

      isSessionCompleted: (sessionId: string) => {
        return get().completedSessionIds.includes(sessionId)
      },
      
      resetAllProgress: () => {
        set({ completedSessionIds: [], currentSession: null })
      },
    }),
    {
      name: 'seb-session-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ 
        completedSessionIds: state.completedSessionIds 
      }),
    }
  )
)
