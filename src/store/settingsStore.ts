import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

export const FONT_SIZE_MIN = 10
export const FONT_SIZE_MAX = 24
export const UI_FONT_SIZE_DEFAULT = 14
export const PREVIEW_FONT_SIZE_DEFAULT = 16

function clampFontSize(size: number): number {
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, size))
}

interface SettingsStore {
  theme: Theme
  uiFontSize: number
  previewFontSize: number
  toggleTheme: () => void
  setUiFontSize: (size: number) => void
  setPreviewFontSize: (size: number) => void
  incrementPreviewFontSize: () => void
  decrementPreviewFontSize: () => void
  resetFontSizes: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      uiFontSize: UI_FONT_SIZE_DEFAULT,
      previewFontSize: PREVIEW_FONT_SIZE_DEFAULT,
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setUiFontSize: (size) => set({ uiFontSize: clampFontSize(size) }),
      setPreviewFontSize: (size) => set({ previewFontSize: clampFontSize(size) }),
      incrementPreviewFontSize: () =>
        set((state) => ({ previewFontSize: clampFontSize(state.previewFontSize + 1) })),
      decrementPreviewFontSize: () =>
        set((state) => ({ previewFontSize: clampFontSize(state.previewFontSize - 1) })),
      resetFontSizes: () =>
        set({ uiFontSize: UI_FONT_SIZE_DEFAULT, previewFontSize: PREVIEW_FONT_SIZE_DEFAULT }),
    }),
    { name: 'glance-settings' },
  ),
)
