import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

interface Props {
  code: string
  lang: string
}

export default function CodeBlock({ code, lang }: Props) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    codeToHtml(code, {
      lang: lang,
      theme: 'tokyo-night',
    })
      .then((result) => {
        if (!cancelled) setHtml(result)
      })
      .catch(() => {
        if (!cancelled) setHtml('')
      })

    return () => {
      cancelled = true
    }
  }, [code, lang])

  if (!html) {
    return <pre className="font-mono bg-[var(--color-bg)] p-4 rounded overflow-x-auto">{code}</pre>
  }

  return (
    <div
      className="rounded overflow-x-auto [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
