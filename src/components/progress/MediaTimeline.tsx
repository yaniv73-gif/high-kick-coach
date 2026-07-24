import { useState } from 'react'
import { Film, Image as ImageIcon, Link2 } from 'lucide-react'
import type { MediaItem } from '../../types'
import { useMediaLibrary } from '../../hooks/useMediaLibrary'
import { useMediaBlobUrl } from '../../hooks/useMediaBlobUrl'
import { EmptyState } from '../layout/EmptyState'
import { formatDateHe } from '../../lib/format'
import { cn } from '../../lib/cn'

function MediaThumb({ item, selected, onToggle }: { item: MediaItem; selected: boolean; onToggle: () => void }) {
  const blobUrl = useMediaBlobUrl(item.thumbnailBlobKey ?? (item.type === 'image' ? item.blobKey : undefined))

  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-center gap-3 w-full rounded-xl border-2 p-2.5 text-start',
        selected ? 'border-brand bg-brand/10' : 'border-border bg-surface-2',
      )}
    >
      <div className="h-14 w-16 shrink-0 rounded-lg bg-surface overflow-hidden flex items-center justify-center">
        {blobUrl ? (
          <img src={blobUrl} alt="" className="h-full w-full object-cover" />
        ) : item.sourceType === 'youtube' || item.sourceType === 'vimeo' ? (
          <Link2 size={22} className="text-text-muted" aria-hidden />
        ) : item.type === 'video' ? (
          <Film size={22} className="text-text-muted" aria-hidden />
        ) : (
          <ImageIcon size={22} className="text-text-muted" aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">
          {item.type === 'video' ? 'סרטון' : 'תמונה'}
          {item.side && ` · צד ${item.side === 'right' ? 'ימין' : item.side === 'left' ? 'שמאל' : 'שניהם'}`}
        </p>
        <p className="text-text-muted text-xs">{formatDateHe(item.createdAt)}</p>
      </div>
    </button>
  )
}

function MediaPlayer({ item }: { item: MediaItem }) {
  const blobUrl = useMediaBlobUrl(item.blobKey)
  if (item.sourceType === 'youtube' || item.sourceType === 'vimeo') {
    return (
      <a href={item.externalUrl} target="_blank" rel="noreferrer" className="text-brand text-xs underline break-all">
        {item.externalUrl}
      </a>
    )
  }
  if (!blobUrl) return <div className="h-40 rounded-lg bg-surface-2 animate-pulse" />
  return item.type === 'video' ? (
    <video src={blobUrl} controls className="w-full rounded-lg bg-black" />
  ) : (
    <img src={blobUrl} alt="" className="w-full rounded-lg object-cover" />
  )
}

export function MediaTimeline() {
  const { items, isLoading } = useMediaLibrary()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  function toggle(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  if (isLoading) return null
  if (items.length === 0) {
    return <EmptyState icon={Film} titleHe="אין עדיין מדיה שמורה" descriptionHe="תמונות וסרטונים מסיכומי אימונים ובדיקות שבועיות יופיעו כאן." />
  }

  const selectedItems = selectedIds.map((id) => items.find((i) => i.id === id)).filter((i): i is MediaItem => !!i)

  return (
    <div className="space-y-3">
      {selectedItems.length > 0 && (
        <div className={cn('grid gap-3', selectedItems.length === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
          {selectedItems.map((item) => (
            <div key={item.id}>
              <p className="text-xs text-text-muted mb-1">{formatDateHe(item.createdAt)}</p>
              <MediaPlayer item={item} />
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-text-muted">בחר עד שני פריטים להשוואה זה לצד זה (סרטון קודם מול נוכחי).</p>
      <div className="space-y-2">
        {items.map((item) => (
          <MediaThumb key={item.id} item={item} selected={selectedIds.includes(item.id)} onToggle={() => toggle(item.id)} />
        ))}
      </div>
    </div>
  )
}
