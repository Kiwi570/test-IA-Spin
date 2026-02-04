// ═══════════════════════════════════════════════════════════════════
// SCRIPTS DE SESSION — Le contenu détaillé de chaque session
// ═══════════════════════════════════════════════════════════════════

export interface SessionScript {
  sessionId: string
  opening: {
    sebMessages: Array<{
      text: string
      variant?: 'normal' | 'anchor'
      pauseAfter?: number
    }>
  }
  exercise: {
    instruction: string
    duration: number // en secondes
    tip?: string
  }
  debrief: {
    // Ces messages sont générés dynamiquement basés sur l'analyse audio
    // Mais on a des templates
    positiveTemplate: string
    improvementTemplate: string
    transitionTemplate: string
  }
  anchor: {
    phrase: string
    cardId: string
  }
  closing: {
    sebMessages: Array<{
      text: string
      variant?: 'normal' | 'anchor'
      pauseAfter?: number
    }>
  }
}

// ═══════════════════════════════════════════════════════════════════
// SESSION 1 — Installer la présence
// ═══════════════════════════════════════════════════════════════════
export const session1Script: SessionScript = {
  sessionId: 'session-1',
  opening: {
    sebMessages: [
      { text: 'Bienvenue.', pauseAfter: 800 },
      { text: 'Ici, tu n\'as rien à prouver.', pauseAfter: 600 },
      { text: 'On va juste écouter ta voix.', pauseAfter: 1000 },
      { text: 'Parle-moi pendant une minute.', pauseAfter: 500 },
      { text: 'De n\'importe quoi.', pauseAfter: 400 },
      { text: 'Comme si on discutait.', pauseAfter: 800 },
    ],
  },
  exercise: {
    instruction: 'Parle librement pendant 1 minute',
    duration: 60,
    tip: 'Pas de timer visible. Seb te dira quand arrêter.',
  },
  debrief: {
    positiveTemplate: 'Ta voix est claire. Elle porte bien.',
    improvementTemplate: 'Elle va parfois un peu vite. Et quand tu ralentis, même légèrement... elle devient plus posée.',
    transitionTemplate: 'C\'est une très bonne base.',
  },
  anchor: {
    phrase: 'Quand tu ralentis, tu prends ta place.',
    cardId: 'card-1',
  },
  closing: {
    sebMessages: [
      { text: 'On s\'arrête là pour aujourd\'hui.', pauseAfter: 600 },
      { text: 'Tu peux revenir quand tu veux.', pauseAfter: 500 },
      { text: 'On continuera à partir de là.', pauseAfter: 800 },
    ],
  },
}

// ═══════════════════════════════════════════════════════════════════
// SESSION 2 — Clarifier avant de parler
// ═══════════════════════════════════════════════════════════════════
export const session2Script: SessionScript = {
  sessionId: 'session-2',
  opening: {
    sebMessages: [
      { text: 'Aujourd\'hui, on travaille la clarté.', pauseAfter: 800 },
      { text: 'Pas la clarté de ta voix.', pauseAfter: 500 },
      { text: 'La clarté de ton intention.', pauseAfter: 800 },
      { text: 'Avant de parler... sais-tu ce que tu veux dire ?', pauseAfter: 1000 },
    ],
  },
  exercise: {
    instruction: 'Choisis un sujet. Identifie UNE idée centrale. Puis présente-la en 45 secondes.',
    duration: 45,
  },
  debrief: {
    positiveTemplate: 'Ton idée était identifiable.',
    improvementTemplate: 'Parfois, tu as ajouté des éléments qui l\'ont diluée.',
    transitionTemplate: 'Une idée claire vaut mieux que dix idées confuses.',
  },
  anchor: {
    phrase: 'La clarté rassure plus que la perfection.',
    cardId: 'card-2',
  },
  closing: {
    sebMessages: [
      { text: 'Retiens ça.', pauseAfter: 500 },
      { text: 'Avant chaque prise de parole : une idée.', pauseAfter: 600 },
      { text: 'À bientôt.', pauseAfter: 800 },
    ],
  },
}

// ═══════════════════════════════════════════════════════════════════
// SESSION 3 — Habiter le silence
// ═══════════════════════════════════════════════════════════════════
export const session3Script: SessionScript = {
  sessionId: 'session-3',
  opening: {
    sebMessages: [
      { text: 'Le silence fait peur à beaucoup.', pauseAfter: 800 },
      { text: 'Ils le remplissent. Ils le fuient.', pauseAfter: 700 },
      { text: 'Toi, tu vas l\'habiter.', pauseAfter: 1000 },
    ],
  },
  exercise: {
    instruction: 'Dis une phrase. Puis silence de 3 secondes. Puis la phrase suivante. Répète pendant 1 minute.',
    duration: 60,
    tip: 'Le silence n\'est pas un vide. C\'est un cadre.',
  },
  debrief: {
    positiveTemplate: 'Tu as tenu les silences.',
    improvementTemplate: 'Certains étaient un peu précipités. Le silence efficace est celui qu\'on assume pleinement.',
    transitionTemplate: 'Le silence donne du poids à ce qui suit.',
  },
  anchor: {
    phrase: 'Le silence n\'est pas un vide. C\'est un cadre.',
    cardId: 'card-3',
  },
  closing: {
    sebMessages: [
      { text: 'Bien.', pauseAfter: 500 },
      { text: 'Le silence est maintenant un outil.', pauseAfter: 600 },
      { text: 'Utilise-le.', pauseAfter: 800 },
    ],
  },
}

// ═══════════════════════════════════════════════════════════════════
// INDEX DES SCRIPTS
// ═══════════════════════════════════════════════════════════════════
export const sessionScripts: Record<string, SessionScript> = {
  'session-1': session1Script,
  'session-2': session2Script,
  'session-3': session3Script,
}

export function getScriptBySessionId(sessionId: string): SessionScript | undefined {
  return sessionScripts[sessionId]
}

export function getScriptByNumber(num: number): SessionScript | undefined {
  return sessionScripts[`session-${num}`]
}
