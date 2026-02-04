import { Variants, Transition } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════
// EASINGS — Courbes d'animation
// ═══════════════════════════════════════════════════════════════════
export const easings = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutExpo: [0.87, 0, 0.13, 1] as const,
  outBack: [0.34, 1.56, 0.64, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
}

// ═══════════════════════════════════════════════════════════════════
// DURÉES — Temps d'animation
// ═══════════════════════════════════════════════════════════════════
export const durations = {
  // Micro-interactions
  instant: 0.075,
  fast: 0.15,
  normal: 0.3,
  
  // Transitions standard
  medium: 0.4,
  slow: 0.5,
  
  // Transitions dramatiques
  dramatic: 0.7,
  page: 0.8,
  seb: 1,
  
  // Animations continues
  breathe: 4,
  pulse: 2,
  glow: 6,
}

// ═══════════════════════════════════════════════════════════════════
// TRANSITIONS — Configurations réutilisables
// ═══════════════════════════════════════════════════════════════════
export const transitions = {
  // Standard pour la plupart des animations d'entrée
  default: {
    duration: durations.slow,
    ease: easings.outExpo,
  } as Transition,
  
  // Pour les transitions de page
  page: {
    duration: durations.page,
    ease: easings.inOutExpo,
  } as Transition,
  
  // Pour les micro-interactions (hover, press)
  micro: {
    duration: durations.fast,
    ease: easings.outExpo,
  } as Transition,
  
  // Avec rebond léger
  bounce: {
    duration: durations.medium,
    ease: easings.outBack,
  } as Transition,
  
  // Spring pour interactions physiques
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  } as Transition,
  
  // Spring rapide
  springFast: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,
}

// ═══════════════════════════════════════════════════════════════════
// VARIANTS — Animations prédéfinies
// ═══════════════════════════════════════════════════════════════════

/**
 * Fade in avec mouvement vers le haut — Standard pour texte Seb
 */
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.dramatic,
      ease: easings.outExpo,
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: durations.normal,
      ease: easings.outQuart,
    }
  }
}

/**
 * Fade in avec scale — Pour cartes et éléments
 */
export const fadeInScale: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.outExpo,
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: durations.normal,
    }
  }
}

/**
 * Slide depuis le bas — Pour modals et cartes conseil
 */
export const slideInBottom: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.medium,
      ease: easings.outExpo,
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: durations.normal,
    }
  }
}

/**
 * Container avec stagger — Pour listes d'éléments
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
}

/**
 * Item de stagger — À utiliser avec staggerContainer
 */
export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.outExpo,
    }
  }
}

/**
 * Respiration de Seb — Animation continue
 */
export const sebBreathe: Variants = {
  breathe: {
    scale: [1, 1.03, 1],
    transition: {
      duration: durations.breathe,
      ease: 'easeInOut',
      repeat: Infinity,
    }
  }
}

/**
 * Pulse du micro — Animation continue
 */
export const micPulse: Variants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: durations.pulse,
      ease: 'easeInOut',
      repeat: Infinity,
    }
  }
}

/**
 * Glow ambient — Animation continue
 */
export const glowPulse: Variants = {
  glow: {
    opacity: [0.1, 0.2, 0.1],
    transition: {
      duration: durations.glow,
      ease: 'easeInOut',
      repeat: Infinity,
    }
  }
}

/**
 * Hover scale — Pour boutons et cartes
 */
export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: transitions.micro,
  },
  tap: { 
    scale: 0.98,
    transition: { duration: durations.instant }
  }
}

/**
 * Transition de page — Entrée
 */
export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: durations.page,
      ease: easings.outExpo,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: durations.medium,
      ease: easings.outQuart,
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// PRESETS POUR TEXTE DE SEB — Apparition mot par mot
// ═══════════════════════════════════════════════════════════════════
export const wordReveal = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      }
    }
  } as Variants,
  
  word: {
    hidden: { 
      opacity: 0, 
      y: 8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: easings.outQuart,
      }
    }
  } as Variants,
}
