import { createContext, createSignal, useContext, type Accessor, type ParentProps, type Setter } from "solid-js";
import type { IPlaylistItemData } from "../api";

interface IPlaylistContext {
  sidebarInfo$: Accessor<IPlaylistItemData | null>
  setSidebarInfo$: Setter<IPlaylistItemData | null>
}

const Context = createContext<IPlaylistContext>()

interface IPlaylistProviderProps {
}

export function PlaylistProvider(props: ParentProps<IPlaylistProviderProps>) {
  const [sidebarInfo, setSidebarInfo] = createSignal<IPlaylistItemData | null>(null)
  
  return (
    <Context.Provider value={{
      setSidebarInfo$: setSidebarInfo,
      sidebarInfo$: sidebarInfo
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}