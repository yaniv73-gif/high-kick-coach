# Exercise media folder

Drop real photos/clips here, then point to them from `src/data/exerciseMedia.ts`
(one line per exercise id — no need to touch `src/data/exercises.ts`).

- `images/<exercise-id>.jpg` — e.g. `images/warmup-skipping.jpg`
- `videos/<exercise-id>.mp4` — e.g. `videos/kick-pivot-drill.mp4`

Exercise ids are listed in `src/data/exercises.ts`. Until media is added here,
the app shows a schematic SVG placeholder per exercise category.
