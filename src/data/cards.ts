import { AdviceCard, ProgressAxis } from '@/types'

// ═══════════════════════════════════════════════════════════════════
// CARTES CONSEIL — Les 14 cartes du parcours
// ═══════════════════════════════════════════════════════════════════

export const adviceCards: AdviceCard[] = [
  {
    id: 'card-1',
    title: 'Ralentir augmente l\'impact',
    principle: 'La vitesse n\'est pas un signe de maîtrise. Quand tu ralentis, tu prends ta place. Tu donnes à chaque mot le temps d\'exister.',
    application: 'Avant de parler, prends une respiration. Entre chaque phrase importante, marque un temps. Ce n\'est pas une pause — c\'est un cadre.',
    anchorPhrase: 'Ralentir, c\'est prendre sa place.',
    category: 'presence',
    isSaved: false,
  },
  {
    id: 'card-2',
    title: 'La clarté rassure plus que la perfection',
    principle: 'Une idée claire vaut mieux que dix idées confuses. Ton public ne retient qu\'une chose. Aide-le en sachant toi-même ce que tu veux dire.',
    application: 'Avant chaque prise de parole, identifie TON idée centrale. Une seule. Si tu ne peux pas la formuler en une phrase, c\'est qu\'elle n\'est pas encore claire.',
    anchorPhrase: 'Une idée. Une direction.',
    category: 'clarity',
    isSaved: false,
  },
  {
    id: 'card-3',
    title: 'Le silence donne du poids aux mots',
    principle: 'Le silence n\'est pas un vide à combler. C\'est un espace qui amplifie ce qui vient avant et ce qui vient après.',
    application: 'Après une phrase importante, compte mentalement jusqu\'à 3 avant de continuer. Le silence crée l\'attente. L\'attente crée l\'attention.',
    anchorPhrase: 'Le silence n\'est pas un vide. C\'est un cadre.',
    category: 'presence',
    isSaved: false,
  },
  {
    id: 'card-4',
    title: 'Ta posture parle avant toi',
    principle: 'L\'autorité ne vient pas des mots. Elle vient de l\'ancrage. Un corps stable transmet une présence stable.',
    application: 'Avant de parler, plante tes pieds. Sens le sol. Redresse-toi sans te raidir. Ton corps doit dire : "Je suis là."',
    anchorPhrase: 'La stabilité crée l\'autorité.',
    category: 'presence',
    isSaved: false,
  },
  {
    id: 'card-5',
    title: 'Le public suit ton rythme',
    principle: 'Tu donnes le tempo. Si tu te précipites, ils se perdent. Si tu poses, ils suivent. Le public s\'aligne sur ton état.',
    application: 'Commence lentement. Établis ton rythme dès les premières secondes. Si tu sens l\'audience décrocher, ralentis — ne va pas plus vite.',
    anchorPhrase: 'C\'est toi qui donnes le tempo.',
    category: 'impact',
    isSaved: false,
  },
  {
    id: 'card-6',
    title: 'Moins de mots, plus de présence',
    principle: 'Le charisme n\'est pas dans l\'abondance. Il est dans la justesse. Chaque mot de trop dilue ton impact.',
    application: 'Après avoir préparé ce que tu veux dire, enlève 20%. Ce qui reste sera plus dense, plus fort, plus mémorable.',
    anchorPhrase: 'La densité crée l\'impact.',
    category: 'presence',
    isSaved: false,
  },
  {
    id: 'card-7',
    title: 'Un leader parle pour aligner',
    principle: 'Tu ne parles pas pour impressionner ou convaincre. Tu parles pour donner une direction claire que les autres peuvent suivre.',
    application: 'Commence par une phrase qui pose le cadre. "Voici ce qu\'on va faire." "Voici où on va." Le reste découle de là.',
    anchorPhrase: 'Parler pour aligner, pas pour impressionner.',
    category: 'leadership',
    isSaved: false,
  },
  {
    id: 'card-8',
    title: 'La crédibilité vient de l\'alignement',
    principle: 'On ne te croit pas parce que tu parles bien. On te croit parce que tu assumes ce que tu dis. L\'alignement entre tes mots et ton intention se sent.',
    application: 'Avant de dire quelque chose d\'important, demande-toi : "Est-ce que je peux assumer cette phrase ?" Si non, reformule jusqu\'à ce que tu puisses.',
    anchorPhrase: 'Ce que tu assumes s\'entend.',
    category: 'leadership',
    isSaved: false,
  },
  {
    id: 'card-9',
    title: 'La dernière minute compte',
    principle: 'On retient la fin. Si tu faiblis dans les dernières secondes, tout ce qui précède s\'effondre. La fin est le sceau de ton message.',
    application: 'Prépare ta dernière phrase. Sache exactement comment tu vas finir. Et quand tu arrives à la fin, ne rajoute rien. Termine net.',
    anchorPhrase: 'La fin scelle le message.',
    category: 'impact',
    isSaved: false,
  },
  {
    id: 'card-10',
    title: 'Conclure en révélant, pas en ajoutant',
    principle: 'Une bonne conclusion ne résume pas — elle révèle. Elle ouvre une porte plutôt qu\'elle en ferme une.',
    application: 'Ta phrase finale doit laisser quelque chose. Une image. Une question. Une direction. Pas un récapitulatif.',
    anchorPhrase: 'Révéler, pas résumer.',
    category: 'impact',
    isSaved: false,
  },
  {
    id: 'card-11',
    title: 'On ne défend pas, on tient',
    principle: 'Face à la résistance, se justifier affaiblit. Tenir sa position sans se raidir la renforce.',
    application: 'Quand on te challenge, ne justifie pas. Reformule ta position calmement. "Je comprends. Et voici ce que je maintiens."',
    anchorPhrase: 'Tenir sans se raidir.',
    category: 'stability',
    isSaved: false,
  },
  {
    id: 'card-12',
    title: 'La fermeté calme rassure',
    principle: 'Dans les moments difficiles, la dureté inquiète. La fermeté calme rassure. La différence est dans le ton, pas dans le fond.',
    application: 'Annonce les décisions difficiles sans t\'excuser, mais sans durcir non plus. Pose les faits. Donne le sens. Reste ouvert aux questions.',
    anchorPhrase: 'Ferme sans être dur.',
    category: 'leadership',
    isSaved: false,
  },
  {
    id: 'card-13',
    title: 'Recadrer plutôt que réagir',
    principle: 'L\'interruption cherche à te déstabiliser. Réagir, c\'est perdre le contrôle. Recadrer, c\'est le reprendre.',
    application: 'Face à une interruption : pause. Respire. Puis une phrase qui recentre. "Laisse-moi finir, et je te réponds." Tu reprends le tempo.',
    anchorPhrase: 'Recadrer, pas réagir.',
    category: 'impact',
    isSaved: false,
  },
  {
    id: 'card-14',
    title: 'Le calme renforce la position',
    principle: 'Dans le désaccord, celui qui reste calme a l\'avantage. L\'agitation affaiblit, la stabilité renforce.',
    application: 'Quand le désaccord monte, baisse ta voix légèrement. Ralentis. Ton calme dira : "Je n\'ai pas besoin de crier pour avoir raison."',
    anchorPhrase: 'Le calme est une force.',
    category: 'leadership',
    isSaved: false,
  },
]

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

export function getCardById(id: string): AdviceCard | undefined {
  return adviceCards.find(c => c.id === id)
}

export function getCardsByCategory(category: ProgressAxis): AdviceCard[] {
  return adviceCards.filter(c => c.category === category)
}

export const axisCategoryLabels: Record<ProgressAxis, string> = {
  presence: 'Présence',
  clarity: 'Clarté',
  stability: 'Stabilité',
  impact: 'Impact',
  leadership: 'Leadership',
}
