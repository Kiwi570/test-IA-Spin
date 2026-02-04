import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CardsStoreState {
  savedCardIds: string[]
  toggleSaveCard: (cardId: string) => void
  isCardSaved: (cardId: string) => boolean
}

export const useCardsStore = create<CardsStoreState>()(
  persist(
    (set, get) => ({
      savedCardIds: [],

      toggleSaveCard: (cardId: string) => {
        const { savedCardIds } = get()
        if (savedCardIds.includes(cardId)) {
          set({ savedCardIds: savedCardIds.filter(id => id !== cardId) })
        } else {
          set({ savedCardIds: [...savedCardIds, cardId] })
        }
      },

      isCardSaved: (cardId: string) => {
        return get().savedCardIds.includes(cardId)
      },
    }),
    {
      name: 'seb-cards-storage',
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
    }
  )
)
