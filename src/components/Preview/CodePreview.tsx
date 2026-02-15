import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

interface Props {
  content: string
  lang: string
}

const EXT_TO_LANG: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  py: 'python',
  rs: 'rust',
  go: 'go',
  java: 'java',
  rb: 'ruby',
  php: 'php',
  c: 'c',
  cpp: 'cpp',
  h: 'c',
  hpp: 'cpp',
  cs: 'csharp',
  swift: 'swift',
  kt: 'kotlin',
  lua: 'lua',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  fish: 'fish',
  css: 'css',
  scss: 'scss',
  less: 'less',
  sql: 'sql',
  graphql: 'graphql',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  xml: 'xml',
  ini: 'ini',
  dockerfile: 'dockerfile',
  makefile: 'makefile',
  vue: 'vue',
  svelte: 'svelte',
  json: 'json',
  md: 'markdown',
}

export function getLangFromExt(ext: string): string {
  return EXT_TO_LANG[ext.toLowerCase()] || 'text'
}

export default function CodePreview({ content, lang }: Props) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    const shikiLang = EXT_TO_LANG[lang] || lang

    codeToHtml(content, {
      lang: shikiLang,
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
  }, [content, lang])

  if (!html) {
    return (
      <pre className="font-mono p-4 overflow-auto whitespace-pre">{content}</pre>
    )
  }

  return (
    <div
      className="overflow-auto h-full [&_pre]:p-4 [&_pre]:min-h-full [&_pre]:overflow-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
