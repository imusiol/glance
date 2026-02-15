import { useState, useEffect, useCallback, useRef } from 'react'
import Toolbar from './components/Layout/Toolbar'
import FileTree from './components/FileTree/FileTree'
import Preview from './components/Preview/Preview'
import QuickOpen from './components/Layout/QuickOpen'
import { useSettingsStore } from './store/settingsStore'

function App() {
  const [quickOpen, setQuickOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(260)
  const dragging = useRef(false)
  const theme = useSettingsStore((s) => s.theme)
  const uiFontSize = useSettingsStore((s) => s.uiFontSize)
  const previewFontSize = useSettingsStore((s) => s.previewFontSize)
  const incrementPreviewFontSize = useSettingsStore((s) => s.incrementPreviewFontSize)
  const decrementPreviewFontSize = useSettingsStore((s) => s.decrementPreviewFontSize)
  const resetFontSizes = useSettingsStore((s) => s.resetFontSizes)

  const handleQuickOpen = useCallback(() => setQuickOpen(true), [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--ui-font-size', `${uiFontSize}px`)
  }, [uiFontSize])

  useEffect(() => {
    document.documentElement.style.setProperty('--preview-font-size', `${previewFontSize}px`)
  }, [previewFontSize])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        setQuickOpen(true)
        return
      }
      if (e.ctrlKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        incrementPreviewFontSize()
        return
      }
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault()
        decrementPreviewFontSize()
        return
      }
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault()
        resetFontSizes()
        return
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [incrementPreviewFontSize, decrementPreviewFontSize, resetFontSizes])

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (e.ctrlKey) {
        e.preventDefault()
        if (e.deltaY < 0) incrementPreviewFontSize()
        else if (e.deltaY > 0) decrementPreviewFontSize()
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [incrementPreviewFontSize, decrementPreviewFontSize])

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    dragging.current = true

    function onMove(ev: MouseEvent) {
      if (dragging.current) {
        const newWidth = Math.max(180, Math.min(ev.clientX, 500))
        setSidebarWidth(newWidth)
      }
    }

    function onUp() {
      dragging.current = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Toolbar onQuickOpen={handleQuickOpen} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div
          className="shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden"
          style={{ width: sidebarWidth }}
        >
          <FileTree />
        </div>

        <div
          className="w-1 shrink-0 cursor-col-resize bg-transparent hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] transition-colors"
          onMouseDown={handleMouseDown}
        />

        <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
          <Preview />
        </div>
      </div>

      <QuickOpen open={quickOpen} onClose={() => setQuickOpen(false)} />
    </div>
  )
}

export default App
