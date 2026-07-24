import type { AppSettings, UserProfile } from '../types'
import { createId } from './id'

const SETTINGS_KEY = 'hkc:settings'
const PROFILE_KEY = 'hkc:profile'

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  autoRestBetweenExercises: true,
  restDurationSeconds: 10,
  startWithWeakSide: true,
  weakSide: 'left',
  textSize: 'normal',
  keepScreenOn: true,
  darkMode: true,
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function defaultProfile(): UserProfile {
  return {
    id: createId(),
    weakSide: 'left',
    strongSide: 'right',
    programStartDate: todayIso(),
  }
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return { ...fallback, ...JSON.parse(raw) } as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getSettings(): AppSettings {
  return readJson(SETTINGS_KEY, DEFAULT_SETTINGS)
}

export function saveSettings(settings: AppSettings): void {
  writeJson(SETTINGS_KEY, settings)
}

export function getProfile(): UserProfile {
  const existing = localStorage.getItem(PROFILE_KEY)
  if (existing) {
    try {
      return { ...defaultProfile(), ...JSON.parse(existing) } as UserProfile
    } catch {
      /* fall through to create a fresh profile */
    }
  }
  const profile = defaultProfile()
  writeJson(PROFILE_KEY, profile)
  return profile
}

export function saveProfile(profile: UserProfile): void {
  writeJson(PROFILE_KEY, profile)
}

export function resetLocalState(): void {
  localStorage.removeItem(SETTINGS_KEY)
  localStorage.removeItem(PROFILE_KEY)
}
