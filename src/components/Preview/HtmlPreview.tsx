import CodePreview from './CodePreview'

interface Props {
  content: string
  showSource: boolean
}

export default function HtmlPreview({ content, showSource }: Props) {
  if (showSource) {
    return <CodePreview content={content} lang="html" />
  }

  return (
    <iframe
      sandbox="allow-scripts"
      srcDoc={content}
      className="w-full h-full border-0 bg-white"
      title="HTML Preview"
    />
  )
}
