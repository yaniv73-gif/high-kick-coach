import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppSettings, UserProfile } from '../types'
import { getProfile, getSettings, saveProfile, saveSettings } from '../lib/storage'
import { getCurrentWeek } from '../lib/progression'

interface AppStateValue {
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void
  profile: UserProfile
  updateProfile: (patch: Partial<UserProfile>) => void
  currentWeek: number
  reloadProfile: () => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings())
  const [profile, setProfile] = useState<UserProfile>(() => getProfile())

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch }
      saveProfile(next)
      return next
    })
  }, [])

  const reloadProfile = useCallback(() => setProfile(getProfile()), [])

  useEffect(() => {
    document.documentElement.dataset.textSize = settings.textSize
  }, [settings.textSize])

  const currentWeek = useMemo(() => getCurrentWeek(profile), [profile])

  const value = useMemo(
    () => ({ settings, updateSettings, profile, updateProfile, currentWeek, reloadProfile }),
    [settings, updateSettings, profile, updateProfile, currentWeek, reloadProfile],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
