import { useCallback, useEffect, useState } from 'react'
import type { MediaItem } from '../types'
import { getAllMediaMeta } from '../lib/db'

export function useMediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setItems(await getAllMediaMeta())
    setIsLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { items, isLoading, reload }
}
