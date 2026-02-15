import { useState, useEffect, useRef, useMemo } from 'react'
import type { FileEntry } from '../../store/fileStore'
import { useFileStore } from '../../store/fileStore'
import { getFileIcon } from '../../utils/fileTypes'

function flattenFiles(entries: FileEntry[], rootPath: string): { name: string; path: string; relative: string }[] {
  const result: { name: string; path: string; relative: string }[] = []

  function walk(items: FileEntry[]) {
    for (const item of items) {
      if (!item.is_dir) {
        result.push({
          name: item.name,
          path: item.path,
          relative: item.path.replace(rootPath + '/', ''),
        })
      }
      if (item.children) walk(item.children)
    }
  }

  walk(entries)
  return result
}

function fuzzyMatch(query: string, text: string): boolean {
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  let qi = 0
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++
  }
  return qi === q.length
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function QuickOpen({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const entries = useFileStore((s) => s.entries)
  const rootPath = useFileStore((s) => s.rootPath)
  const selectFile = useFileStore((s) => s.selectFile)

  const allFiles = useMemo(
    () => (rootPath ? flattenFiles(entries, rootPath) : []),
    [entries, rootPath],
  )

  const filtered = useMemo(() => {
    if (!query) return allFiles.slice(0, 50)
    return allFiles.filter((f) => fuzzyMatch(query, f.relative)).slice(0, 50)
  }, [query, allFiles])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      selectFile(filtered[selectedIndex].path)
      onClose()
    }
  }

  function handleSelect(path: string) {
    selectFile(path)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div
        className="w-[500px] max-w-[90vw] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wyszukaj plik..."
          className="w-full px-4 py-3 bg-transparent text-[var(--color-fg)] text-sm outline-none border-b border-[var(--color-border)] placeholder:text-[var(--color-fg-muted)]"
        />
        <div className="max-h-[300px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[var(--color-fg-muted)]">
              Brak wyników
            </div>
          ) : (
            filtered.map((file, i) => (
              <div
                key={file.path}
                className={`flex items-center px-4 py-1.5 text-sm cursor-pointer ${
                  i === selectedIndex
                    ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                    : 'hover:bg-[var(--color-hover)]'
                }`}
                onClick={() => handleSelect(file.path)}
              >
                <span className="mr-2 text-xs">{getFileIcon(file.name, false)}</span>
                <span className="truncate">{file.name}</span>
                <span
                  className={`ml-2 text-xs truncate ${
                    i === selectedIndex ? 'opacity-70' : 'text-[var(--color-fg-muted)]'
                  }`}
                >
                  {file.relative}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
