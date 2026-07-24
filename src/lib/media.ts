export const MAX_IMAGE_BYTES = 8 * 1024 * 1024 // 8MB before compression
export const MAX_VIDEO_BYTES = 80 * 1024 * 1024 // 80MB — IndexedDB can hold it, but warn early

export interface FileSizeCheck {
  ok: boolean
  messageHe?: string
}

export function checkFileSize(file: File, maxBytes: number, labelHe: string): FileSizeCheck {
  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024))
    return { ok: false, messageHe: `${labelHe} גדול מדי (מעל ${maxMb}MB). בחר קובץ קטן יותר.` }
  }
  return { ok: true }
}

/** Basic client-side compression: downscale + re-encode as JPEG via canvas. */
export async function compressImage(file: File, maxDimension = 1280, quality = 0.75): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), 'image/jpeg', quality)
  })
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      resolve(Number.isFinite(video.duration) ? Math.round(video.duration) : 0)
    }
    video.onerror = () => resolve(0)
    video.src = URL.createObjectURL(file)
  })
}

export function generateVideoThumbnail(file: File): Promise<Blob | undefined> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.src = URL.createObjectURL(file)

    video.onloadeddata = () => {
      video.currentTime = Math.min(0.5, video.duration / 2)
    }
    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 320
      canvas.height = video.videoHeight || 180
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(video.src)
        resolve(undefined)
        return
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(video.src)
        resolve(blob ?? undefined)
      }, 'image/jpeg', 0.7)
    }
    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      resolve(undefined)
    }
  })
}
