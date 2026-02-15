import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useFileStore } from '../../store/fileStore'
import { getPreviewType } from '../../utils/fileTypes'
import MarkdownPreview from './MarkdownPreview'
import CodePreview from './CodePreview'
import HtmlPreview from './HtmlPreview'
import PlainTextPreview from './PlainTextPreview'
import JsonPreview from './JsonPreview'

export default function Preview() {
  const selectedFile = useFileStore((s) => s.selectedFile)
  const [content, setContent] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [showSource, setShowSource] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedFile) {
      setContent('')
      setError(null)
      return
    }

    setShowSource(false)
    setLoading(true)

    invoke<string>('read_file', { path: selectedFile })
      .then((data) => {
        setContent(data)
        setError(null)
      })
      .catch((err) => {
        setError(String(err))
        setContent('')
      })
      .finally(() => setLoading(false))
  }, [selectedFile])

  if (!selectedFile) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-fg-muted)] text-sm">
        Wybierz plik aby zobaczyć podgląd
      </div>
    )
  }

  const fileName = selectedFile.split('/').pop() || ''
  const ext = fileName.split('.').pop() || ''
  const previewType = getPreviewType(fileName)
  const hasSourceToggle = previewType === 'markdown' || previewType === 'html'

  function renderContent() {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full text-[var(--color-fg-muted)] text-sm">
          Wczytywanie...
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-400 text-sm p-4">
          {error}
        </div>
      )
    }

    switch (previewType) {
      case 'markdown':
        return <MarkdownPreview content={content} showSource={showSource} />
      case 'code':
        return <CodePreview content={content} lang={ext} />
      case 'html':
        return <HtmlPreview content={content} showSource={showSource} />
      case 'json':
        return <JsonPreview content={content} />
      case 'text':
      default:
        return <PlainTextPreview content={content} />
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] shrink-0">
        <span className="text-sm truncate text-[var(--color-fg)]">{fileName}</span>
        <span className="ml-2 text-xs text-[var(--color-fg-muted)] uppercase">{previewType}</span>

        {hasSourceToggle && (
          <button
            onClick={() => setShowSource(!showSource)}
            className="ml-auto text-xs px-2 py-1 rounded bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors border border-[var(--color-border)] cursor-pointer"
          >
            {showSource ? 'Preview' : 'Source'}
          </button>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-auto" style={{ fontSize: 'var(--preview-font-size, 16px)' }}>
        {renderContent()}
      </div>
    </div>
  )
}
