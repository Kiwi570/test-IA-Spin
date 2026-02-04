import { create } from 'zustand'
import { AudioState, AudioAnalysis } from '@/types'

interface AudioStoreState extends AudioState {
  // Internal
  _audioLevelInterval: NodeJS.Timeout | null
  _durationInterval: NodeJS.Timeout | null
  
  // Actions
  startRecording: () => void
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  updateAudioLevel: (level: number) => void
  updateDuration: (duration: number) => void
  setTranscription: (text: string) => void
  setAnalysis: (analysis: AudioAnalysis) => void
  resetAudio: () => void
}

const initialState: AudioState = {
  isRecording: false,
  isPaused: false,
  audioLevel: 0,
  duration: 0,
  transcription: '',
  analysis: null,
}

// Génère une analyse simulée basée sur la durée
function generateSimulatedAnalysis(duration: number): AudioAnalysis {
  return {
    rhythm: {
      wordsPerMinute: 110 + Math.random() * 40,  // 110-150 WPM
      variations: 0.2 + Math.random() * 0.3,
      isMonotone: Math.random() < 0.2,
    },
    silences: {
      count: Math.floor(duration / 15) + Math.floor(Math.random() * 3),
      averageDuration: 0.8 + Math.random() * 0.7,
      wellPlaced: Math.floor(Math.random() * 4),
    },
    energy: {
      level: 0.4 + Math.random() * 0.4,
      consistency: 0.5 + Math.random() * 0.4,
      peakMoments: duration > 30 ? [duration * 0.3, duration * 0.7] : [],
    },
    clarity: {
      articulation: 0.6 + Math.random() * 0.35,
      hesitations: ['euh', 'donc'],
      fillerWords: Math.floor(Math.random() * 5),
    },
    prosodie: {
      melodicVariation: 0.2 + Math.random() * 0.5,
      endOfSentenceDrops: Math.floor(Math.random() * 3),
    },
  }
}

export const useAudioStore = create<AudioStoreState>()((set, get) => ({
  ...initialState,
  _audioLevelInterval: null,
  _durationInterval: null,

  startRecording: () => {
    // Nettoyer les anciens intervalles
    const state = get()
    if (state._audioLevelInterval) clearInterval(state._audioLevelInterval)
    if (state._durationInterval) clearInterval(state._durationInterval)
    
    // Simuler les niveaux audio (en attendant vraie capture)
    const audioLevelInterval = setInterval(() => {
      const currentState = get()
      if (currentState.isRecording && !currentState.isPaused) {
        // Simuler un niveau audio qui varie naturellement
        const baseLevel = 0.3 + Math.random() * 0.4
        const spike = Math.random() < 0.1 ? 0.3 : 0  // Pics occasionnels
        set({ audioLevel: Math.min(1, baseLevel + spike) })
      }
    }, 100)
    
    // Compteur de durée
    const durationInterval = setInterval(() => {
      const currentState = get()
      if (currentState.isRecording && !currentState.isPaused) {
        set({ duration: currentState.duration + 1 })
      }
    }, 1000)
    
    set({
      isRecording: true,
      isPaused: false,
      duration: 0,
      audioLevel: 0.3,
      transcription: '',
      analysis: null,
      _audioLevelInterval: audioLevelInterval,
      _durationInterval: durationInterval,
    })
  },

  stopRecording: () => {
    const state = get()
    
    // Nettoyer les intervalles
    if (state._audioLevelInterval) clearInterval(state._audioLevelInterval)
    if (state._durationInterval) clearInterval(state._durationInterval)
    
    // Générer une analyse simulée
    const analysis = generateSimulatedAnalysis(state.duration)
    
    set({
      isRecording: false,
      isPaused: false,
      audioLevel: 0,
      analysis,
      _audioLevelInterval: null,
      _durationInterval: null,
    })
  },

  pauseRecording: () => {
    set({ isPaused: true })
  },

  resumeRecording: () => {
    set({ isPaused: false })
  },

  updateAudioLevel: (level: number) => {
    set({ audioLevel: Math.max(0, Math.min(1, level)) })
  },

  updateDuration: (duration: number) => {
    set({ duration })
  },

  setTranscription: (text: string) => {
    set({ transcription: text })
  },

  setAnalysis: (analysis: AudioAnalysis) => {
    set({ analysis })
  },

  resetAudio: () => {
    const state = get()
    if (state._audioLevelInterval) clearInterval(state._audioLevelInterval)
    if (state._durationInterval) clearInterval(state._durationInterval)
    
    set({
      ...initialState,
      _audioLevelInterval: null,
      _durationInterval: null,
    })
  },
}))
