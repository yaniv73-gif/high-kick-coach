// Central place to attach real media to exercises without touching exercises.ts.
// Put files under /public/exercises/images or /public/exercises/videos (see the
// README there), then reference them here by exercise id. Anything left out
// falls back to the schematic SVG placeholder.
//
// Example:
// 'kick-pivot-drill': { video: '/exercises/videos/kick-pivot-drill.mp4' },

export const EXERCISE_MEDIA_OVERRIDES: Record<string, { image?: string; video?: string }> = {}
