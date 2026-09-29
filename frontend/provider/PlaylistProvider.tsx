import { createContext, createSignal, onMount, useContext, type Accessor, type ParentProps, type Setter } from "solid-js"
import { CODEC, type IPlaylistItemData } from "../api"
import { usePersistedSignal } from "../hooks/usePersistedSignal"
import { duckDotLog } from "../utils"
import { createMediaPlayer, type MediaPlayer } from "../hooks"
import { createPlayerlistState, type PlayerlistState } from "./trackState"

interface IPlaylistContext {
  sidebarInfo$: Accessor<IPlaylistItemData | null>
  setSidebarInfo$: Setter<IPlaylistItemData | null>
  playlistItems$: Accessor<IPlaylistItemData[]>
  trackPlayer$: MediaPlayer<"audio">
  playlistState$: PlayerlistState
}

const Context = createContext<IPlaylistContext>()

interface IPlaylistProviderProps {
}

export function PlaylistProvider(props: ParentProps<IPlaylistProviderProps>) {
  const [sidebarInfo, setSidebarInfo] = usePersistedSignal<IPlaylistItemData | null>(localStorage, 'sidebar_info', null)
  const [playlistItems, setPlaylistItems] = createSignal<IPlaylistItemData[]>([])

  onMount(async() => {
    const items = await CODEC.playlist_getAll$()
    setPlaylistItems(items)
    if (sidebarInfo()) {
      duckDotLog("resyncing sidebar info...")
      const newSidebarInfo = items.find(it => it.id === sidebarInfo()!.id)!
      console.assert(newSidebarInfo !== undefined, `${sidebarInfo()?.id} does not exist!!`)
      setSidebarInfo(newSidebarInfo)
    }
  })

  const trackPlayer = createMediaPlayer("audio")
  const trackState = createPlayerlistState(trackPlayer)

  return (
    <Context.Provider value={{
      setSidebarInfo$: setSidebarInfo,
      sidebarInfo$: sidebarInfo,
      playlistItems$: playlistItems,
      trackPlayer$: trackPlayer,
      playlistState$: trackState
    }}>
      <trackPlayer.Player$ />
      {props.children}
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}