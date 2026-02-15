import { useState } from 'react'

interface Props {
  content: string
}

function JsonNode({ data, depth = 0 }: { data: unknown; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2)
  const indent = depth * 16

  if (data === null) return <span className="text-[var(--color-fg-muted)]">null</span>
  if (typeof data === 'boolean') return <span className="text-purple-400">{String(data)}</span>
  if (typeof data === 'number') return <span className="text-orange-400">{data}</span>
  if (typeof data === 'string') return <span className="text-green-400">"{data}"</span>

  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>

    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] cursor-pointer"
        >
          {collapsed ? '▸' : '▾'}
        </button>
        <span className="text-[var(--color-fg-muted)]"> [{data.length}]</span>
        {collapsed ? (
          <span className="text-[var(--color-fg-muted)]"> ...</span>
        ) : (
          <div>
            {data.map((item, i) => (
              <div key={i} style={{ paddingLeft: indent + 16 }}>
                <JsonNode data={item} depth={depth + 1} />
                {i < data.length - 1 && <span className="text-[var(--color-fg-muted)]">,</span>}
              </div>
            ))}
            <div style={{ paddingLeft: indent }}>]</div>
          </div>
        )}
      </span>
    )
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>)
    if (entries.length === 0) return <span>{'{}'}</span>

    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] cursor-pointer"
        >
          {collapsed ? '▸' : '▾'}
        </button>
        <span className="text-[var(--color-fg-muted)]">
          {' {'}
          {entries.length}
          {'}'}
        </span>
        {collapsed ? (
          <span className="text-[var(--color-fg-muted)]"> ...</span>
        ) : (
          <div>
            {entries.map(([key, value], i) => (
              <div key={key} style={{ paddingLeft: indent + 16 }}>
                <span className="text-[var(--color-accent)]">"{key}"</span>
                <span className="text-[var(--color-fg-muted)]">: </span>
                <JsonNode data={value} depth={depth + 1} />
                {i < entries.length - 1 && (
                  <span className="text-[var(--color-fg-muted)]">,</span>
                )}
              </div>
            ))}
            <div style={{ paddingLeft: indent }}>{'}'}</div>
          </div>
        )}
      </span>
    )
  }

  return <span>{String(data)}</span>
}

export default function JsonPreview({ content }: Props) {
  let parsed: unknown
  let parseError: string | null = null

  try {
    parsed = JSON.parse(content)
  } catch (e) {
    parseError = String(e)
  }

  if (parseError) {
    return (
      <div className="p-4">
        <div className="text-red-400 text-sm mb-2">Invalid JSON: {parseError}</div>
        <pre className="text-sm font-mono whitespace-pre-wrap">{content}</pre>
      </div>
    )
  }

  return (
    <div className="font-mono p-4 overflow-auto h-full">
      <JsonNode data={parsed} />
    </div>
  )
}
