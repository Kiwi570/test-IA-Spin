'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useAudioStore } from '@/stores'
import { isClient } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════
interface UseAudioRecorderOptions {
  onDataAvailable?: (blob: Blob) => void
  onStop?: (blob: Blob) => void
  analyzeAudioLevel?: boolean
}

interface UseAudioRecorderReturn {
  isRecording: boolean
  isPaused: boolean
  audioLevel: number
  duration: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  error: string | null
}

// ═══════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════
export function useAudioRecorder(
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn {
  const { onDataAvailable, onStop, analyzeAudioLevel = true } = options

  // State local
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Store global
  const {
    isRecording,
    isPaused,
    audioLevel,
    startRecording: storeStart,
    stopRecording: storeStop,
    pauseRecording: storePause,
    resumeRecording: storeResume,
    updateAudioLevel,
    updateDuration,
  } = useAudioStore()

  // ─────────────────────────────────────────────────────────────────
  // Analyse du niveau audio en temps réel
  // ─────────────────────────────────────────────────────────────────
  const analyzeLevel = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculer le niveau moyen (0-1)
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
    const normalizedLevel = average / 255

    updateAudioLevel(normalizedLevel)

    if (isRecording && !isPaused) {
      animationFrameRef.current = requestAnimationFrame(analyzeLevel)
    }
  }, [isRecording, isPaused, updateAudioLevel])

  // ─────────────────────────────────────────────────────────────────
  // Démarrer l'enregistrement
  // ─────────────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (!isClient) return
    setError(null)
    chunksRef.current = []

    try {
      // Demander l'accès au micro
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Créer le MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })
      mediaRecorderRef.current = mediaRecorder

      // Configurer l'analyse audio si activée
      if (analyzeAudioLevel) {
        audioContextRef.current = new AudioContext()
        const source = audioContextRef.current.createMediaStreamSource(stream)
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 256
        source.connect(analyserRef.current)
      }

      // Events
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
          onDataAvailable?.(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onStop?.(blob)

        // Nettoyer
        stream.getTracks().forEach(track => track.stop())
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
      }

      // Démarrer
      mediaRecorder.start(1000) // Chunk toutes les secondes
      storeStart()

      // Timer de durée
      setDuration(0)
      durationIntervalRef.current = setInterval(() => {
        setDuration(d => {
          const newDuration = d + 1
          updateDuration(newDuration)
          return newDuration
        })
      }, 1000)

      // Démarrer l'analyse
      if (analyzeAudioLevel) {
        analyzeLevel()
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur d\'accès au microphone'
      setError(message)
      console.error('Audio recording error:', err)
    }
  }, [analyzeAudioLevel, onDataAvailable, onStop, storeStart, updateDuration, analyzeLevel])

  // ─────────────────────────────────────────────────────────────────
  // Arrêter l'enregistrement
  // ─────────────────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
    }

    storeStop()
    updateAudioLevel(0)
  }, [storeStop, updateAudioLevel])

  // ─────────────────────────────────────────────────────────────────
  // Pause / Resume
  // ─────────────────────────────────────────────────────────────────
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      storePause()
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [storePause])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      storeResume()

      // Reprendre le timer
      durationIntervalRef.current = setInterval(() => {
        setDuration(d => {
          const newDuration = d + 1
          updateDuration(newDuration)
          return newDuration
        })
      }, 1000)

      // Reprendre l'analyse
      if (analyzeAudioLevel) {
        analyzeLevel()
      }
    }
  }, [storeResume, updateDuration, analyzeAudioLevel, analyzeLevel])

  // ─────────────────────────────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    isRecording,
    isPaused,
    audioLevel,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    error,
  }
}
