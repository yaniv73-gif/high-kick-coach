// Central place to attach real media to exercises without touching exercises.ts.
// Put files under /public/exercises/images or /public/exercises/videos (see the
// README there), then reference them here by exercise id. Anything left out
// falls back to the schematic SVG placeholder.
//
// The `video` links below are third-party YouTube demos found by searching for
// each movement — not hosted or endorsed by this app. Most are close/exact
// name matches; entries marked "(approx.)" are the closest generic reference
// for a custom combo drill this program composed (no single video shows that
// exact sequence). Spot-check before relying on them for coaching cues.

export const EXERCISE_MEDIA_OVERRIDES: Record<string, { image?: string; video?: string }> = {
  // ---- Workout A ----
  'warmup-skipping': { video: 'https://www.youtube.com/watch?v=V46V_VBHLIg' },
  'warmup-leg-swings-fb': { video: 'https://www.youtube.com/watch?v=0XvKtEZ4i38' },
  'warmup-leg-swings-side': { video: 'https://www.youtube.com/watch?v=U3Px6O-4M1E' },
  'warmup-cossack-dynamic': { video: 'https://www.youtube.com/watch?v=fimRXfoWm2c' },
  'mobility-90-90-transitions': { video: 'https://www.youtube.com/watch?v=HUZimFZJZWU' },
  'mobility-90-90-back-leg-lift': { video: 'https://www.youtube.com/watch?v=B1JZG4VQ1UI' },
  'mobility-adductor-rock-back': { video: 'https://www.youtube.com/watch?v=FkxBaLFrlSE' },
  'mobility-hip-airplane': { video: 'https://www.youtube.com/watch?v=WMLuxQLduWc' },
  'strength-standing-leg-raise-front': { video: 'https://www.youtube.com/watch?v=sr7mheyn4io' },
  'strength-side-leg-raise-support': { video: 'https://www.youtube.com/watch?v=WmOeBJ5j_A4' },
  'strength-chamber-hold': { video: 'https://www.youtube.com/watch?v=X7K4KY2E4XQ' }, // (approx.) general chamber technique
  'strength-chamber-extension': { video: 'https://www.youtube.com/watch?v=H8c9EpbrK5A' }, // (approx.) side-kick chamber drill, not roundhouse
  'kick-pivot-drill': { video: 'https://www.youtube.com/watch?v=Iq-1U8M5GUs' },
  'kick-slow-3-phase': { video: 'https://www.youtube.com/watch?v=yn_MSTEUa6E' },
  'kick-hold': { video: 'https://www.youtube.com/watch?v=4Yx8D5u1Vsc' },
  'kick-free-technical': { video: 'https://www.youtube.com/watch?v=5ZQcvzeKLJg' },
  'stretch-hip-flexor-half-kneel': { video: 'https://www.youtube.com/watch?v=bnVfloe6yTo' },
  'stretch-hamstring-half-split': { video: 'https://www.youtube.com/watch?v=1wXNELxZI4I' },
  'stretch-frog': { video: 'https://www.youtube.com/watch?v=NSLweeodozw' },
  'stretch-90-90-forward-lean': { video: 'https://www.youtube.com/watch?v=50yYFq4Fe_8' },

  // ---- Workout B ----
  'warmup-knee-to-chest-walk': { video: 'https://www.youtube.com/watch?v=GVU4paANHoE' },
  'warmup-walking-straight-kicks': { video: 'https://www.youtube.com/watch?v=hFtfcXUT27k' },
  'warmup-lateral-lunge-alt': { video: 'https://www.youtube.com/watch?v=KokacN8Imp8' },
  'warmup-pelvic-circles': { video: 'https://www.youtube.com/watch?v=OvJMG4_nMFc' },
  'warmup-light-middle-kick': { video: 'https://www.youtube.com/watch?v=dn5mWFsaU-g' },
  'mobility-wgs-rotation': { video: 'https://www.youtube.com/watch?v=Ma2Mpin0Uow' },
  'mobility-cossack-pause': { video: 'https://www.youtube.com/watch?v=Q_CBjpWxEy0' },
  'mobility-heel-raise-straddle': { video: 'https://www.youtube.com/watch?v=bWiGNUBHcKg' }, // (approx.) closest is a seated straddle raise short
  'mobility-internal-rotation-90-90': { video: 'https://www.youtube.com/watch?v=6Vm24G-koYU' },
  'strength-standing-knee-raise-obstacle': { video: 'https://www.youtube.com/watch?v=YUpeReHQl_w' }, // (approx.) no cone-specific video found
  'strength-side-lying-adductor-raise': { video: 'https://www.youtube.com/watch?v=oF2hKgn5HkM' },
  'strength-side-leg-raise-obstacle': { video: 'https://www.youtube.com/watch?v=NoFGTHsEImk' }, // (approx.) generic side leg raise, no obstacle variant found
  'strength-eccentric-lowering': { video: 'https://www.youtube.com/watch?v=SZXOPRVP1Oc' }, // (approx.) general eccentric step-down, not kick-specific
  'kick-knee-up-pivot': { video: 'https://www.youtube.com/watch?v=gFDr9gv3IvY' },
  'kick-knee-up-pivot-extend': { video: 'https://www.youtube.com/watch?v=ooAcs6n3X5A' }, // (approx.)
  'kick-over-marker': { video: 'https://www.youtube.com/watch?v=0VZJTifiTXM' }, // (approx.) general kicking accuracy drill
  'kick-double-no-foot-down': { video: 'https://www.youtube.com/watch?v=rBZGjZtVASE' }, // (approx.) double roundhouse combo, close but not identical
  'stretch-adductor-side-lunge': { video: 'https://www.youtube.com/watch?v=HzdAMw5Si84' },
  'stretch-hamstring-strap': { video: 'https://www.youtube.com/watch?v=9gfcG47p_h4' },
  'stretch-figure-four': { video: 'https://www.youtube.com/watch?v=-g0nuyTHMrI' },
  'stretch-butterfly': { video: 'https://www.youtube.com/watch?v=oeXsYDBep5s' },
}
