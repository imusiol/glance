interface Props {
  content: string
}

export default function PlainTextPreview({ content }: Props) {
  const lines = content.split('\n')

  return (
    <div className="font-mono p-4 overflow-auto h-full">
      <table className="border-collapse">
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className="leading-6">
              <td className="pr-4 text-right text-[var(--color-fg-muted)] select-none w-10 align-top">
                {i + 1}
              </td>
              <td className="whitespace-pre-wrap break-all">{line}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
