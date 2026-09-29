import { createSignal } from "solid-js";
import type { IPlaylistItemData } from "../api";

export function createPlaylistGlobalState() {
  const [sidebarInfo, setSidebarInfo] = createSignal<IPlaylistItemData | null>(null)

  return {
    sidebarInfo$: sidebarInfo,
    setSidebarInfo$: setSidebarInfo
  }
}

export type PlaylistGlobalState = ReturnType<typeof createPlaylistGlobalState> 