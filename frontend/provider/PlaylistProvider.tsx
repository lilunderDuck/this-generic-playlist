import { createContext, createSignal, onMount, useContext, type Accessor, type ParentProps, type Setter } from "solid-js"
import { CODEC, type IPlaylistItemData } from "../api"
import { usePersistedSignal } from "../hooks/usePersistedSignal"
import { duckDotLog, duckDotLogWithLabel } from "../utils"
import { createMediaPlayer, type MediaPlayer } from "../hooks"
import { createPlayerlistState, type PlayerlistState } from "./trackState"

interface IPlaylistContext {
  sidebarInfo$: Accessor<IPlaylistItemData | null>
  setSidebarInfo$: Setter<IPlaylistItemData | null>
  playlistItems$: Accessor<IPlaylistItemData[]>
  trackPlayer$: MediaPlayer<"audio">
  playlistState$: PlayerlistState
  resyncPlaylist$(playlistId: string): Promise<void>
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
      duckDotLogWithLabel("state transition", "RESYNC_SIDEBAR_INFO for:", sidebarInfo()?.name)
      const newSidebarInfo = items.find(it => it.id === sidebarInfo()!.id)!
      console.assert(newSidebarInfo !== undefined, `${sidebarInfo()?.id} does not exist!!`)
      setSidebarInfo(newSidebarInfo)
    }
  })

  const trackPlayer = createMediaPlayer("audio")
  const trackState = createPlayerlistState(trackPlayer)

  const resyncPlaylist: IPlaylistContext["resyncPlaylist$"] = async(playlistId) => {
    const resyncedData = await CODEC.playlist_resync$({
      playlistId: playlistId
    })

    if (sidebarInfo()?.id === resyncedData.playlist.id) {
      setSidebarInfo(null)
      setSidebarInfo(resyncedData.playlist)
    }

    if (trackState.currentPlaylist$()?.id === resyncedData.playlist.id) {
      trackState.syncData$(resyncedData.playlist, resyncedData.tracks)
    }
  }

  return (
    <Context.Provider value={{
      setSidebarInfo$: setSidebarInfo,
      sidebarInfo$: sidebarInfo,
      playlistItems$: playlistItems,
      trackPlayer$: trackPlayer,
      playlistState$: trackState,
      resyncPlaylist$: resyncPlaylist
    }}>
      <trackPlayer.Player$ />
      {props.children}
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}