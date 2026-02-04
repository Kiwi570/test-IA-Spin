'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Mic, MicOff } from 'lucide-react'
import { SebPresence } from '@/components/blocks'
import { Button } from '@/components/primitives'

interface Message {
  id: string
  role: 'user' | 'seb'
  content: string
  timestamp: Date
}

const SEB_RESPONSES = [
  "Je t'écoute. Qu'est-ce qui te préoccupe ?",
  "C'est une bonne question. Prends le temps d'y réfléchir avant de répondre.",
  "Tu progresses. Continue comme ça.",
  "Le doute fait partie du chemin. L'important c'est d'avancer.",
  "Rappelle-toi : la clarté vient en parlant, pas avant.",
  "Qu'est-ce qui t'empêche d'être pleinement toi quand tu parles ?",
  "La perfection n'existe pas. L'authenticité, si.",
  "Chaque prise de parole est une opportunité, pas un test.",
]

function getRandomResponse(): string {
  return SEB_RESPONSES[Math.floor(Math.random() * SEB_RESPONSES.length)]
}

export default function ConversationPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'seb',
      content: "Salut. Comment tu te sens aujourd'hui par rapport à ta parole ?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sebState, setSebState] = useState<'idle' | 'speaking' | 'listening'>('idle')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setSebState('speaking')

    // Simuler un délai de réponse
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    const sebMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'seb',
      content: getRandomResponse(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, sebMessage])
    setIsTyping(false)
    setSebState('idle')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-deep/80 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => router.push('/home')}
            className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10">
              <SebPresence state={sebState} size="sm" />
            </div>
            <div>
              <h1 className="font-medium text-text-primary">Seb</h1>
              <p className="text-xs text-text-muted">
                {isTyping ? 'écrit...' : 'Ton coach vocal'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gold-400 text-bg-deep'
                      : 'bg-bg-elevated text-text-primary'
                  }`}
                >
                  {message.role === 'seb' && (
                    <p className="text-xs text-gold-400 mb-1 font-medium">Seb</p>
                  )}
                  <p className={`text-sm leading-relaxed ${message.role === 'seb' ? 'font-serif' : ''}`}>
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-bg-elevated rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gold-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-bg-deep/80 backdrop-blur-lg border-t border-white/5 p-4 pb-safe">
        <div className="max-w-2xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écris ton message..."
              className="w-full bg-bg-elevated border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-gold-400/50 transition-colors"
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-center text-xs text-text-muted mt-3">
          Seb est là pour t'accompagner, pas pour te juger.
        </p>
      </div>
    </div>
  )
}
