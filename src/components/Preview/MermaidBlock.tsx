import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'dark',
})

let mermaidCounter = 0

interface Props {
  code: string
}

export default function MermaidBlock({ code }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = `mermaid-${++mermaidCounter}`

    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          setError(null)
        }
      })
      .catch((err) => {
        setError(String(err))
      })
  }, [code])

  if (error) {
    return (
      <div className="border border-red-400/30 rounded p-3 my-2">
        <div className="text-red-400 text-xs mb-1">Mermaid error</div>
        <pre className="text-xs text-[var(--color-fg-muted)]">{code}</pre>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center [&_svg]:max-w-full"
    />
  )
}
