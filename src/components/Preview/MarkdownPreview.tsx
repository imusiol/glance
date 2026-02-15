import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import CodeBlock from './CodeBlock'
import MermaidBlock from './MermaidBlock'

interface Props {
  content: string
  showSource: boolean
}

export default function MarkdownPreview({ content, showSource }: Props) {
  if (showSource) {
    return (
      <pre className="whitespace-pre-wrap break-words font-mono p-4 text-[var(--color-fg)]">
        {content}
      </pre>
    )
  }

  return (
    <div className="prose max-w-none p-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, node, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const lang = match ? match[1] : null
            const codeString = String(children).replace(/\n$/, '')
            const isBlock = node?.position && node.position.start.line !== node.position.end.line

            if (lang === 'mermaid') {
              return <MermaidBlock code={codeString} />
            }

            if (lang) {
              return <CodeBlock code={codeString} lang={lang} />
            }

            if (isBlock) {
              return (
                <pre className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-4 overflow-x-auto whitespace-pre font-mono">
                  <code {...props}>{children}</code>
                </pre>
              )
            }

            return (
              <code
                className="bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            )
          },
          pre({ children }) {
            return <>{children}</>
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table className="border-collapse border border-[var(--color-border)]">
                  {children}
                </table>
              </div>
            )
          },
          th({ children }) {
            return (
              <th className="border border-[var(--color-border)] px-3 py-2 bg-[var(--color-bg-tertiary)] text-left">
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="border border-[var(--color-border)] px-3 py-2">{children}</td>
            )
          },
          a({ children, href }) {
            return (
              <a
                href={href}
                className="text-[var(--color-accent)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
