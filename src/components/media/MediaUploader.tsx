import { useRef, useState } from 'react'
import { Camera, Video, Link as LinkIcon, X, Loader2 } from 'lucide-react'
import type { MediaItem, SideOrBoth } from '../../types'
import { checkFileSize, compressImage, generateVideoThumbnail, getVideoDuration, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from '../../lib/media'
import { saveMedia } from '../../lib/db'
import { createId } from '../../lib/id'
import { Button } from '../ui/Button'
import { useToast } from '../ui/Toast'

interface MediaUploaderProps {
  labelHe: string
  kind: 'image' | 'video'
  side?: SideOrBoth
  onUploaded: (item: MediaItem) => void
  uploaded?: MediaItem
  onRemove?: () => void
}

export function MediaUploader({ labelHe, kind, side, onUploaded, uploaded, onRemove }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState('')
  const { showToast } = useToast()

  async function handleFile(file: File) {
    const maxBytes = kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES
    const check = checkFileSize(file, maxBytes, kind === 'image' ? 'התמונה' : 'הסרטון')
    if (!check.ok) {
      showToast(check.messageHe!, 'error')
      return
    }

    setIsProcessing(true)
    try {
      const id = createId()
      if (kind === 'image') {
        const blob = await compressImage(file)
        const meta: MediaItem = {
          id,
          type: 'image',
          createdAt: new Date().toISOString(),
          side,
          sourceType: 'upload',
          blobKey: id,
          sizeBytes: blob.size,
        }
        await saveMedia(meta, blob)
        onUploaded(meta)
      } else {
        const [duration, thumbnail] = await Promise.all([getVideoDuration(file), generateVideoThumbnail(file)])
        const thumbId = thumbnail ? createId() : undefined
        const meta: MediaItem = {
          id,
          type: 'video',
          createdAt: new Date().toISOString(),
          side,
          sourceType: 'upload',
          blobKey: id,
          thumbnailBlobKey: thumbId,
          durationSeconds: duration,
          sizeBytes: file.size,
        }
        await saveMedia(meta, file)
        if (thumbId && thumbnail) await saveMedia({ ...meta, id: thumbId }, thumbnail)
        onUploaded(meta)
      }
      showToast('הקובץ נשמר בהצלחה', 'success')
    } catch {
      showToast('שגיאה בשמירת הקובץ', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  function handleUrlSubmit() {
    if (!url.trim()) return
    const isYoutube = /youtu\.?be/.test(url)
    const meta: MediaItem = {
      id: createId(),
      type: 'video',
      createdAt: new Date().toISOString(),
      side,
      sourceType: isYoutube ? 'youtube' : 'vimeo',
      externalUrl: url.trim(),
    }
    saveMedia(meta)
    onUploaded(meta)
    setUrl('')
    setShowUrlInput(false)
  }

  if (uploaded) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5">
        <span className="text-sm truncate">{labelHe} — נשמר</span>
        {onRemove && (
          <button aria-label="הסר" onClick={onRemove} className="text-text-muted hover:text-danger shrink-0">
            <X size={18} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={kind === 'image' ? 'image/*' : 'video/*'}
        capture={kind === 'image' ? 'environment' : 'user'}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          fullWidth
          disabled={isProcessing}
          onClick={() => inputRef.current?.click()}
        >
          {isProcessing ? <Loader2 size={18} className="animate-spin" /> : kind === 'image' ? <Camera size={18} /> : <Video size={18} />}
          {labelHe}
        </Button>
        {kind === 'video' && (
          <Button type="button" variant="ghost" size="md" onClick={() => setShowUrlInput((v) => !v)} aria-label="הוסף קישור">
            <LinkIcon size={18} />
          </Button>
        )}
      </div>
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="קישור YouTube או Vimeo"
            className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm"
          />
          <Button type="button" size="md" onClick={handleUrlSubmit}>
            הוסף
          </Button>
        </div>
      )}
    </div>
  )
}
