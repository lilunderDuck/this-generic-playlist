import { createContext, createSignal, useContext, type Accessor, type ParentProps, type Setter } from "solid-js";
import { CODEC, type IPlaylistItemData } from "../api";

interface IPlaylistContext {
  sidebarInfo$: Accessor<IPlaylistItemData | null>
  setSidebarInfo$: Setter<IPlaylistItemData | null>
  playlistItems$: Accessor<IPlaylistItemData[]>
}

const Context = createContext<IPlaylistContext>()

interface IPlaylistProviderProps {
}

export function PlaylistProvider(props: ParentProps<IPlaylistProviderProps>) {
  const [sidebarInfo, setSidebarInfo] = createSignal<IPlaylistItemData | null>(null)
  const [playlistItems, setPlaylistItems] = createSignal<IPlaylistItemData[]>([])

  CODEC.playlist_getAll$().then((itemData) => {
    setPlaylistItems(itemData)
  })
  
  return (
    <Context.Provider value={{
      setSidebarInfo$: setSidebarInfo,
      sidebarInfo$: sidebarInfo,
      playlistItems$: playlistItems
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}