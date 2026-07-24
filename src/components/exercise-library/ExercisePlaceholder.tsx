import type { ExerciseCategory, Side } from '../../types'

type PoseVariant = 'warmup' | 'mobility' | 'strength' | 'kick' | 'stretch' | 'generic'

const CATEGORY_TO_POSE: Partial<Record<ExerciseCategory, PoseVariant>> = {
  warmup: 'warmup',
  mobility: 'mobility',
  pelvis: 'mobility',
  strength: 'strength',
  'hip-flexors': 'strength',
  adductors: 'mobility',
  'kick-technique': 'kick',
  'pivot-leg': 'kick',
  stretch: 'stretch',
  hamstring: 'stretch',
  balance: 'strength',
}

function resolvePose(categories: ExerciseCategory[]): PoseVariant {
  for (const category of categories) {
    const pose = CATEGORY_TO_POSE[category]
    if (pose) return pose
  }
  return 'generic'
}

const STROKE = 'var(--color-brand-light)'
const HEAD = <circle cx="60" cy="26" r="9" fill="none" stroke={STROKE} strokeWidth="3" />

const POSES: Record<PoseVariant, React.ReactNode> = {
  warmup: (
    <>
      {HEAD}
      <path d="M60 35 L58 62 M58 62 L44 78 M58 62 L74 50" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M60 44 L46 40 M60 44 L78 56" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  mobility: (
    <>
      {HEAD}
      <path d="M60 35 L62 58" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M62 58 L40 66 L36 84 M62 58 L82 62 L88 82" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M60 42 L44 46 M60 42 L76 46" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  strength: (
    <>
      {HEAD}
      <path d="M60 35 L58 60 L56 84" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M58 60 L86 48" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M60 42 L44 50 M60 42 L74 34" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  kick: (
    <>
      {HEAD}
      <path d="M60 35 L54 60" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M54 60 L38 78" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M54 60 L92 44" fill="none" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M60 42 L42 38 M60 42 L48 58" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  stretch: (
    <>
      {HEAD}
      <path d="M60 35 L64 56 L48 68" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M48 68 L84 72" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M64 56 L86 60" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  generic: (
    <>
      {HEAD}
      <path d="M60 35 L60 68" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M60 46 L44 56 M60 46 L76 56" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M60 68 L48 92 M60 68 L72 92" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
}

interface ExercisePlaceholderProps {
  categories: ExerciseCategory[]
  side?: Side
  className?: string
  imageUrl?: string
}

export function ExercisePlaceholder({ categories, side, className, imageUrl }: ExercisePlaceholderProps) {
  const pose = resolvePose(categories)

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="הדגמת התרגיל"
        className={className}
        style={{ objectFit: 'cover', borderRadius: 12, transform: side === 'left' ? 'scaleX(-1)' : undefined }}
      />
    )
  }

  return (
    <svg
      viewBox="0 0 120 110"
      className={className}
      role="img"
      aria-label="איור סכמטי של התרגיל"
      style={{ transform: side === 'left' ? 'scaleX(-1)' : undefined }}
    >
      <rect x="0" y="0" width="120" height="110" rx="16" fill="var(--color-surface-2)" />
      <line x1="10" y1="96" x2="110" y2="96" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />
      {POSES[pose]}
    </svg>
  )
}
