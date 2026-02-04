import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, UserIntention, UserPreferences } from '@/types'
import { generateId } from '@/lib/utils'

interface UserState {
  user: User | null
  _hasHydrated: boolean
  
  // Actions
  initUser: () => void
  setIntention: (intention: UserIntention) => void
  completeOnboarding: () => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  resetUser: () => void
  setHasHydrated: (state: boolean) => void
}

const defaultPreferences: UserPreferences = {
  soundEnabled: true,
  voiceMode: true,
  hapticFeedback: true,
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      },

      initUser: () => {
        const { user } = get()
        if (!user) {
          set({
            user: {
              id: generateId(),
              intention: null,
              isOnboarded: false,
              createdAt: new Date(),
              preferences: defaultPreferences,
            }
          })
        }
      },

      setIntention: (intention: UserIntention) => {
        const { user } = get()
        if (user) {
          set({
            user: { ...user, intention }
          })
        }
      },

      completeOnboarding: () => {
        const { user } = get()
        if (user) {
          set({
            user: { ...user, isOnboarded: true }
          })
        }
      },

      updatePreferences: (prefs: Partial<UserPreferences>) => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              preferences: { ...user.preferences, ...prefs }
            }
          })
        }
      },

      resetUser: () => {
        set({ user: null })
      },
    }),
    {
      name: 'seb-user-storage',
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
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
