import { useFileStore } from '../../store/fileStore'

export default function Breadcrumb() {
  const rootPath = useFileStore((s) => s.rootPath)
  const selectedFile = useFileStore((s) => s.selectedFile)

  if (!rootPath) return null

  const displayPath = selectedFile
    ? selectedFile.replace(rootPath, '').replace(/^\//, '')
    : ''

  if (!displayPath) return null

  const parts = displayPath.split('/')

  return (
    <div className="flex items-center text-xs text-[var(--color-fg-muted)] gap-1 overflow-hidden">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center shrink-0">
          {i > 0 && <span className="mx-1 text-[var(--color-border)]">/</span>}
          <span className={i === parts.length - 1 ? 'text-[var(--color-fg)]' : ''}>
            {part}
          </span>
        </span>
      ))}
    </div>
  )
}
