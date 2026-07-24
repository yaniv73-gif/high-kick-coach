import { useSound } from './useSound'
import { useVibration } from './useVibration'
import { useAppState } from '../store/AppStateContext'

export function useWorkoutCues() {
  const { settings } = useAppState()
  const sound = useSound(settings.soundEnabled)
  const vibration = useVibration(settings.vibrationEnabled)

  return {
    cueStart: () => {
      sound.playStart()
      vibration.vibrateStart()
    },
    cueWarning: () => {
      sound.playWarning()
      vibration.vibrateWarning()
    },
    cueFinish: () => {
      sound.playFinish()
      vibration.vibrateFinish()
    },
    cueTap: () => {
      sound.playTap()
      vibration.vibrateTap()
    },
  }
}
