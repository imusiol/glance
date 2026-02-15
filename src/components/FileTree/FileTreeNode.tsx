import type { FileEntry } from '../../store/fileStore'
import { useFileStore } from '../../store/fileStore'
import { getFileIcon } from '../../utils/fileTypes'

interface Props {
  entry: FileEntry
  depth: number
}

function timeAgo(modified: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - modified
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

const RECENT_THRESHOLD = 30 * 60 // 30 minutes

function isRecent(modified: number): boolean {
  const now = Math.floor(Date.now() / 1000)
  return now - modified < RECENT_THRESHOLD
}

export default function FileTreeNode({ entry, depth }: Props) {
  const { selectedFile, expandedDirs, selectFile, toggleDir } = useFileStore()

  const isExpanded = expandedDirs.has(entry.path)
  const isSelected = selectedFile === entry.path
  const recent = !entry.is_dir && isRecent(entry.modified)
  const icon = getFileIcon(entry.name, entry.is_dir, isExpanded)

  function handleClick() {
    if (entry.is_dir) {
      toggleDir(entry.path)
    } else {
      selectFile(entry.path)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center cursor-pointer py-0.5 px-2 hover:bg-[var(--color-hover)] ${
          isSelected ? 'bg-[var(--color-bg-tertiary)]' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
      >
        {entry.is_dir && (
          <span className="mr-1 text-[var(--color-fg-muted)] text-xs w-3">
            {isExpanded ? '▾' : '▸'}
          </span>
        )}
        {!entry.is_dir && <span className="mr-1 w-3" />}

        <span className="mr-1.5 text-sm">{icon}</span>

        <span
          className={`truncate flex-1 text-sm ${
            recent ? 'text-[var(--color-accent)] font-semibold' : ''
          }`}
        >
          {entry.name}
        </span>

        {recent && (
          <span className="text-xs text-[var(--color-fg-muted)] ml-2 shrink-0">
            {timeAgo(entry.modified)}
          </span>
        )}
      </div>

      {entry.is_dir && isExpanded && entry.children && (
        <div>
          {entry.children.map((child) => (
            <FileTreeNode key={child.path} entry={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
