import { useState } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'
import type { FileEntry } from '../../store/fileStore'
import { useFileStore } from '../../store/fileStore'
import { useSettingsStore } from '../../store/settingsStore'
import Breadcrumb from './Breadcrumb'
import FontSizePopover from './FontSizePopover'

interface Props {
  onQuickOpen: () => void
}

export default function Toolbar({ onQuickOpen }: Props) {
  const rootPath = useFileStore((s) => s.rootPath)
  const setRootPath = useFileStore((s) => s.setRootPath)
  const setEntries = useFileStore((s) => s.setEntries)
  const selectFile = useFileStore((s) => s.selectFile)
  const theme = useSettingsStore((s) => s.theme)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)
  const [fontPopover, setFontPopover] = useState(false)

  async function handleOpenFolder() {
    const selected = await open({ directory: true, multiple: false })
    if (selected && typeof selected === 'string') {
      setRootPath(selected)
      selectFile(null)
      const entries = await invoke<FileEntry[]>('read_directory', { path: selected })
      setEntries(entries)
    }
  }

  const folderName = rootPath ? rootPath.split('/').pop() : null

  return (
    <div className="flex items-center px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] gap-3">
      <button
        onClick={handleOpenFolder}
        className="text-xs px-3 py-1 rounded bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors border border-[var(--color-border)] cursor-pointer shrink-0"
      >
        Otwórz folder
      </button>

      {folderName && (
        <span className="text-sm text-[var(--color-fg-muted)] shrink-0">{folderName}</span>
      )}

      <Breadcrumb />

      <div className="ml-auto flex items-center gap-2 shrink-0">
        {rootPath && (
          <button
            onClick={onQuickOpen}
            className="text-xs px-2 py-1 rounded bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-hover)] border border-[var(--color-border)] cursor-pointer text-[var(--color-fg-muted)]"
            title="Szybkie wyszukiwanie (Ctrl+P)"
          >
            Ctrl+P
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setFontPopover(!fontPopover)}
            className="text-xs px-2 py-1 rounded bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-hover)] border border-[var(--color-border)] cursor-pointer"
            title="Rozmiar czcionki (Ctrl+/-)"
          >
            Aa
          </button>
          <FontSizePopover open={fontPopover} onClose={() => setFontPopover(false)} />
        </div>
        <button
          onClick={toggleTheme}
          className="text-xs px-2 py-1 rounded bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-hover)] border border-[var(--color-border)] cursor-pointer"
          title={theme === 'dark' ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </div>
  )
}
