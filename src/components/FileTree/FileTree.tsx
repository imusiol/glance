import type { FileEntry, SortMode } from '../../store/fileStore'
import { useFileStore } from '../../store/fileStore'
import FileTreeNode from './FileTreeNode'

const RECENT_THRESHOLD = 30 * 60

function isRecent(modified: number): boolean {
  return Math.floor(Date.now() / 1000) - modified < RECENT_THRESHOLD
}

function hasRecentChildren(entry: FileEntry): boolean {
  if (!entry.is_dir) return isRecent(entry.modified)
  return entry.children?.some(hasRecentChildren) ?? false
}

function sortEntries(entries: FileEntry[], mode: SortMode): FileEntry[] {
  const sorted = [...entries].sort((a, b) => {
    // Dirs always first
    if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1

    if (mode === 'modified') {
      return b.modified - a.modified
    }
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })

  return sorted.map((e) => {
    if (e.is_dir && e.children) {
      return { ...e, children: sortEntries(e.children, mode) }
    }
    return e
  })
}

function filterRecent(entries: FileEntry[]): FileEntry[] {
  return entries
    .filter((e) => (e.is_dir ? hasRecentChildren(e) : isRecent(e.modified)))
    .map((e) => {
      if (e.is_dir && e.children) {
        return { ...e, children: filterRecent(e.children) }
      }
      return e
    })
}

export default function FileTree() {
  const entries = useFileStore((s) => s.entries)
  const rootPath = useFileStore((s) => s.rootPath)
  const sortMode = useFileStore((s) => s.sortMode)
  const showOnlyRecent = useFileStore((s) => s.showOnlyRecent)
  const setSortMode = useFileStore((s) => s.setSortMode)
  const toggleShowOnlyRecent = useFileStore((s) => s.toggleShowOnlyRecent)

  if (!rootPath) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-fg-muted)] text-sm p-4">
        Otwórz folder aby zobaczyć pliki
      </div>
    )
  }

  let processed = sortEntries(entries, sortMode)
  if (showOnlyRecent) {
    processed = filterRecent(processed)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-[var(--color-border)] shrink-0">
        <button
          onClick={() => setSortMode(sortMode === 'name' ? 'modified' : 'name')}
          className="text-xs px-2 py-0.5 rounded bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-hover)] border border-[var(--color-border)] cursor-pointer"
          title={sortMode === 'name' ? 'Sortuj wg daty' : 'Sortuj wg nazwy'}
        >
          {sortMode === 'name' ? 'A-Z' : 'Nowe'}
        </button>
        <button
          onClick={toggleShowOnlyRecent}
          className={`text-xs px-2 py-0.5 rounded border cursor-pointer ${
            showOnlyRecent
              ? 'bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)]'
              : 'bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-hover)] border-[var(--color-border)]'
          }`}
          title="Pokaż tylko ostatnio zmienione"
        >
          Zmienione
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {processed.length === 0 ? (
          <div className="text-[var(--color-fg-muted)] text-sm p-4 text-center">
            {showOnlyRecent ? 'Brak zmian w ostatnich 30 min' : 'Pusty folder'}
          </div>
        ) : (
          processed.map((entry) => (
            <FileTreeNode key={entry.path} entry={entry} depth={0} />
          ))
        )}
      </div>
    </div>
  )
}
