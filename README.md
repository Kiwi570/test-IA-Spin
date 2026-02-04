# 🎙️ Seb — Coach IA de parole incarnée

<div align="center">
  <img src="public/seb-logo.svg" alt="Seb Logo" width="120" />
  
  **Développe ta présence, ta clarté et ton impact à l'oral**
  
  [Demo](https://seb.app) · [Documentation](#) · [Roadmap](#roadmap)
</div>

---

## ✨ Vision

Seb n'est pas un juge. C'est un compagnon qui t'aide à **habiter ta propre voix** — plutôt que jouer un rôle. L'objectif : développer ta présence, ta clarté, ta confiance, sans évaluation écrasante.

## 🎯 Fonctionnalités Phase 1

- **14 sessions guidées** — Un parcours progressif de développement
- **Feedback narratif** — Seb commente ta parole comme un coach bienveillant
- **Cartes conseil** — Principes clés à retenir et appliquer
- **Mode urgence** — Stabilisation rapide avant une prise de parole
- **Cartographie de progression** — Visualise ton évolution sur 5 axes

## 🏗️ Architecture

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── onboarding/        # Première expérience
│   ├── home/              # Espace Seb principal
│   ├── session/[id]/      # Sessions guidées
│   ├── sessions/          # Liste des sessions
│   ├── cards/             # Bibliothèque de cartes
│   ├── progress/          # Cartographie progression
│   └── urgency/           # Mode urgence
├── components/
│   ├── primitives/        # Atomes (Button, Text, Card...)
│   ├── blocks/            # Composants métier (SebPresence, MicIndicator...)
│   └── layouts/           # Structures de page
├── stores/                # État global (Zustand)
├── lib/                   # Utilitaires et animations
├── data/                  # Données statiques (sessions, cartes)
├── types/                 # Types TypeScript
└── styles/                # CSS global
```

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build
npm start
```

## 🎨 Design System

### Palette de couleurs

| Token | Valeur | Usage |
|-------|--------|-------|
| `bg-deep` | `#050506` | Fond immersif |
| `bg-primary` | `#0A0A0B` | Fond principal |
| `accent-gold` | `#D4A853` | Actions, Seb |
| `accent-emerald` | `#10B981` | Succès, moments wow |
| `text-primary` | `#F5F5F4` | Texte principal |

### Typographie

- **Voix de Seb** : Spectral (serif élégant)
- **Interface** : Inter (sans-serif moderne)

### Animations

Toutes les animations utilisent des courbes organiques :
- `ease-out-expo` : Entrées d'éléments
- `ease-in-out-expo` : Transitions de page
- Springs : Interactions physiques

## 📁 Structure des composants

### Primitives (`/components/primitives`)
```tsx
<Text variant="seb" animate>Bienvenue.</Text>
<Button variant="primary">Commencer</Button>
<Card variant="interactive">...</Card>
<Badge variant="gold">En cours</Badge>
```

### Blocks (`/components/blocks`)
```tsx
<SebPresence state="speaking" audioLevel={0.5} />
<SebMessage text="Merci." animate onComplete={() => {}} />
<MicIndicator state="recording" audioLevel={0.7} />
<AdviceCard card={card} onSave={() => {}} />
```

### Layouts (`/components/layouts`)
```tsx
<MainLayout>...</MainLayout>      // Avec navigation
<SessionLayout>...</SessionLayout> // Immersif
<CenteredLayout>...</CenteredLayout>
```

## 🗃️ État global (Zustand)

```tsx
// Stores disponibles
import { useUserStore, useSessionStore, useProgressStore, useAudioStore } from '@/stores'

// Exemple d'utilisation
const { user, setIntention } = useUserStore()
const { startSession, advanceStep } = useSessionStore()
```

## 🛣️ Roadmap

### Phase 1 — Le cœur qui parle ✅
- [x] Design system complet
- [x] Composants de base
- [x] Navigation et layouts
- [x] Page d'onboarding
- [x] Espace Seb (home)
- [x] Liste des sessions
- [x] Structure session guidée

### Phase 2 — L'arène s'éveille
- [ ] Audio Engine (capture, analyse)
- [ ] Ambiance Engine (public sonore)
- [ ] Sessions complètes avec feedback
- [ ] Debrief structuré

### Phase 3 — La mémoire s'installe
- [ ] Progress Engine (cartographie)
- [ ] Détection moments wow
- [ ] Historique des sessions

### Phase 4 — L'expansion
- [ ] Modes de jeu avancés
- [ ] Profils de public multiples
- [ ] Variantes de Seb

## 🔧 Stack technique

| Layer | Technologie |
|-------|-------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| State | Zustand |
| Components | Radix UI (primitives) |

## 📝 Conventions

### Fichiers
- Components : `PascalCase.tsx`
- Hooks : `useCamelCase.ts`
- Stores : `camelCaseStore.ts`

### CSS
- Utiliser les classes Tailwind du design system
- Éviter les styles inline sauf pour les valeurs dynamiques
- Utiliser `cn()` pour combiner les classes

### Animations
- Importer depuis `@/lib/animations`
- Utiliser les variants Framer Motion prédéfinis
- Respecter les durées et easings du design system

## 🤝 Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Ouvre une Pull Request

## 📄 License

MIT © Seb AI

---

<div align="center">
  <sub>Fait avec ❤️ pour ceux qui veulent parler avec justesse</sub>
</div>
