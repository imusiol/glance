import { create } from 'zustand'

export interface FileEntry {
  name: string
  path: string
  is_dir: boolean
  size: number
  modified: number
  children: FileEntry[] | null
}

export type SortMode = 'name' | 'modified'

interface FileStore {
  rootPath: string | null
  entries: FileEntry[]
  selectedFile: string | null
  expandedDirs: Set<string>
  sortMode: SortMode
  showOnlyRecent: boolean

  setRootPath: (path: string) => void
  setEntries: (entries: FileEntry[]) => void
  selectFile: (path: string | null) => void
  toggleDir: (path: string) => void
  setSortMode: (mode: SortMode) => void
  toggleShowOnlyRecent: () => void
}

export const useFileStore = create<FileStore>((set) => ({
  rootPath: null,
  entries: [],
  selectedFile: null,
  expandedDirs: new Set(),
  sortMode: 'name',
  showOnlyRecent: false,

  setRootPath: (path) => set({ rootPath: path, expandedDirs: new Set() }),
  setEntries: (entries) => set({ entries }),
  selectFile: (path) => set({ selectedFile: path }),
  toggleDir: (path) =>
    set((state) => {
      const next = new Set(state.expandedDirs)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return { expandedDirs: next }
    }),
  setSortMode: (mode) => set({ sortMode: mode }),
  toggleShowOnlyRecent: () =>
    set((state) => ({ showOnlyRecent: !state.showOnlyRecent })),
}))
