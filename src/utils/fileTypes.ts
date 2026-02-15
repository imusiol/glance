const EXTENSION_ICONS: Record<string, string> = {
  // Folders
  folder: '📁',
  'folder-open': '📂',

  // Markdown
  md: '📝',
  mdx: '📝',

  // Code
  ts: '🔷',
  tsx: '⚛️',
  js: '🟨',
  jsx: '⚛️',
  py: '🐍',
  rs: '🦀',
  go: '🔵',
  java: '☕',
  rb: '💎',
  php: '🐘',
  c: '🔧',
  cpp: '🔧',
  h: '🔧',

  // Config / Data
  json: '📋',
  yaml: '📋',
  yml: '📋',
  toml: '📋',
  xml: '📋',
  csv: '📊',

  // Web
  html: '🌐',
  css: '🎨',
  scss: '🎨',
  svg: '🖼️',

  // Text
  txt: '📄',
  log: '📄',
  env: '🔒',

  // Config files
  gitignore: '🙈',
  dockerignore: '🐳',
  dockerfile: '🐳',
  makefile: '⚙️',
  lock: '🔒',
}

export function getFileIcon(name: string, isDir: boolean, isOpen = false): string {
  if (isDir) return isOpen ? '📂' : '📁'

  const lower = name.toLowerCase()

  // Check full filename first (e.g. Dockerfile, Makefile)
  if (EXTENSION_ICONS[lower]) return EXTENSION_ICONS[lower]

  // Check dot-prefixed names (e.g. .gitignore)
  const dotless = lower.startsWith('.') ? lower.slice(1) : null
  if (dotless && EXTENSION_ICONS[dotless]) return EXTENSION_ICONS[dotless]

  // Check extension
  const ext = lower.split('.').pop() || ''
  return EXTENSION_ICONS[ext] || '📄'
}

export type PreviewType = 'markdown' | 'code' | 'html' | 'text' | 'json' | 'image' | 'unknown'

const CODE_EXTENSIONS = new Set([
  'ts', 'tsx', 'js', 'jsx', 'py', 'rs', 'go', 'java', 'rb', 'php',
  'c', 'cpp', 'h', 'hpp', 'cs', 'swift', 'kt', 'scala', 'lua',
  'sh', 'bash', 'zsh', 'fish', 'ps1',
  'css', 'scss', 'less', 'sass',
  'sql', 'graphql', 'gql',
  'yaml', 'yml', 'toml', 'xml', 'ini', 'cfg',
  'dockerfile', 'makefile',
  'vue', 'svelte',
])

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'bmp'])

export function getPreviewType(name: string): PreviewType {
  const lower = name.toLowerCase()
  const ext = lower.split('.').pop() || ''

  if (ext === 'md' || ext === 'mdx') return 'markdown'
  if (ext === 'html' || ext === 'htm') return 'html'
  if (ext === 'json') return 'json'
  if (IMAGE_EXTENSIONS.has(ext)) return 'image'
  if (CODE_EXTENSIONS.has(ext)) return 'code'

  // Dot files as code
  if (lower.startsWith('.')) return 'code'

  // Files without extension or known text files
  if (ext === 'txt' || ext === 'log' || ext === '' || ext === 'env') return 'text'

  return 'text'
}
