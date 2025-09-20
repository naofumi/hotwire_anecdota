import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";

type SlideDrawerState = {
  drawers: {
    [key: string]: { opened: boolean }
  }
  opened: (key: string) => boolean
  open: (key: string) => void
  close: (key: string) => void
};

export const slideDrawerStore = createStore<SlideDrawerState>()(
  subscribeWithSelector(
    (set, get) => ({
      drawers: {},
      opened: (key) => get().drawers[key]?.opened ?? false,
      open: (key) => set(s => ({ drawers: { ...s.drawers, [key]: { opened: true } } })),
      close: (key) => set(s => ({ drawers: { ...s.drawers, [key]: { opened: false } } })),
    }),
  )
);
