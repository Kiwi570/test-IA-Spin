import { create } from 'zustand'
import { AmbianceState, AudienceProfile } from '@/types'

interface AmbianceStoreState extends AmbianceState {
  // Actions
  activateAmbiance: (profile: AudienceProfile) => void
  deactivateAmbiance: () => void
  updateAttention: (level: number) => void
  setReaction: (reaction: string) => void
  resetAmbiance: () => void
}

const initialState: AmbianceState = {
  isActive: false,
  profile: 'neutral',
  attentionLevel: 0.5,
  lastReaction: null,
}

export const useAmbianceStore = create<AmbianceStoreState>()((set) => ({
  ...initialState,

  activateAmbiance: (profile: AudienceProfile) => {
    set({
      isActive: true,
      profile,
      attentionLevel: 0.5,
      lastReaction: null,
    })
  },

  deactivateAmbiance: () => {
    set({
      isActive: false,
      attentionLevel: 0.5,
      lastReaction: null,
    })
  },

  updateAttention: (level: number) => {
    set({ attentionLevel: Math.max(0, Math.min(1, level)) })
  },

  setReaction: (reaction: string) => {
    set({ lastReaction: reaction })
  },

  resetAmbiance: () => {
    set(initialState)
  },
}))
