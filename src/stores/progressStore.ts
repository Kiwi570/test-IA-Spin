import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ProgressData, ProgressHistory, WowMoment, ProgressAxis } from '@/types'
import { generateId } from '@/lib/utils'

interface ProgressStoreState {
  // État actuel des axes
  axes: ProgressData
  
  // Historique
  history: ProgressHistory[]
  
  // Moments wow
  wowMoments: WowMoment[]
  
  // Actions
  updateAxes: (updates: Partial<ProgressData>, sessionId: string) => void
  addWowMoment: (moment: Omit<WowMoment, 'id' | 'createdAt'>) => void
  removeWowMoment: (id: string) => void
  getProgressSince: (days: number) => { previous: ProgressData; current: ProgressData }
  getAxisProgress: (axis: ProgressAxis) => number[]
}

const initialAxes: ProgressData = {
  presence: 20,
  clarity: 20,
  stability: 20,
  impact: 20,
  leadership: 20,
}

export const useProgressStore = create<ProgressStoreState>()(
  persist(
    (set, get) => ({
      axes: initialAxes,
      history: [],
      wowMoments: [],

      updateAxes: (updates: Partial<ProgressData>, sessionId: string) => {
        const { axes, history } = get()
        const newAxes = { ...axes }
        
        // Appliquer les updates avec progression douce (max +5 par session)
        Object.entries(updates).forEach(([key, value]) => {
          const axisKey = key as keyof ProgressData
          const currentValue = axes[axisKey]
          const maxIncrease = 5
          const increase = Math.min(value || 0, maxIncrease)
          newAxes[axisKey] = Math.min(100, currentValue + increase)
        })
        
        // Sauvegarder dans l'historique
        const historyEntry: ProgressHistory = {
          date: new Date(),
          data: { ...newAxes },
          sessionId,
        }
        
        set({
          axes: newAxes,
          history: [...history, historyEntry],
        })
      },

      addWowMoment: (moment) => {
        const { wowMoments } = get()
        const newMoment: WowMoment = {
          ...moment,
          id: generateId(),
          createdAt: new Date(),
        }
        set({
          wowMoments: [...wowMoments, newMoment],
        })
      },

      removeWowMoment: (id: string) => {
        const { wowMoments } = get()
        set({
          wowMoments: wowMoments.filter(m => m.id !== id),
        })
      },

      getProgressSince: (days: number) => {
        const { axes, history } = get()
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        
        // Trouver le premier enregistrement après la date de cutoff
        const relevantHistory = history.filter(h => new Date(h.date) >= cutoffDate)
        const previous = relevantHistory.length > 0 
          ? relevantHistory[0].data 
          : initialAxes
        
        return {
          previous,
          current: axes,
        }
      },

      getAxisProgress: (axis: ProgressAxis) => {
        const { history } = get()
        return history.map(h => h.data[axis])
      },
    }),
    {
      name: 'seb-progress-storage',
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
        axes: state.axes,
        history: state.history,
        wowMoments: state.wowMoments,
      }),
    }
  )
)
