import { useEffect, useRef } from 'react'
import {
  useSettingsStore,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  UI_FONT_SIZE_DEFAULT,
  PREVIEW_FONT_SIZE_DEFAULT,
} from '../../store/settingsStore'

interface Props {
  open: boolean
  onClose: () => void
}

export default function FontSizePopover({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const uiFontSize = useSettingsStore((s) => s.uiFontSize)
  const previewFontSize = useSettingsStore((s) => s.previewFontSize)
  const setUiFontSize = useSettingsStore((s) => s.setUiFontSize)
  const setPreviewFontSize = useSettingsStore((s) => s.setPreviewFontSize)
  const resetFontSizes = useSettingsStore((s) => s.resetFontSizes)

  const isDefault =
    uiFontSize === UI_FONT_SIZE_DEFAULT && previewFontSize === PREVIEW_FONT_SIZE_DEFAULT

  useEffect(() => {
    if (!open) return

    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-1 z-50 w-56 p-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] shadow-lg"
    >
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-[var(--color-fg-muted)]">UI</label>
          <span className="text-xs text-[var(--color-fg-muted)]">{uiFontSize}px</span>
        </div>
        <input
          type="range"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          value={uiFontSize}
          onChange={(e) => setUiFontSize(Number(e.target.value))}
          className="w-full accent-[var(--color-accent)] h-1 cursor-pointer"
        />
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-[var(--color-fg-muted)]">Preview</label>
          <span className="text-xs text-[var(--color-fg-muted)]">{previewFontSize}px</span>
        </div>
        <input
          type="range"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          value={previewFontSize}
          onChange={(e) => setPreviewFontSize(Number(e.target.value))}
          className="w-full accent-[var(--color-accent)] h-1 cursor-pointer"
        />
      </div>

      <button
        onClick={resetFontSizes}
        disabled={isDefault}
        className="w-full text-xs py-1 rounded bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-hover)] border border-[var(--color-border)] cursor-pointer disabled:opacity-40 disabled:cursor-default transition-colors"
      >
        Reset ({UI_FONT_SIZE_DEFAULT}/{PREVIEW_FONT_SIZE_DEFAULT}px)
      </button>
    </div>
  )
}
