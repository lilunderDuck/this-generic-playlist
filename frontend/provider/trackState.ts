import { createSignal } from "solid-js"
import { playlistTrackUrl, type IPlaylistItemData, type ITrackData } from "../api"
import type { MediaPlayer } from "../hooks"

export const enum LoopingState {
  REPEAT_ONCE = 0,
  REPEAT_PLAYLIST = 1,
  NO_REPEAT = 2,
}

export function createTrackState(player: MediaPlayer<"audio">) {
  const [currentPlaylist, setCurrentPlaylist] = createSignal<IPlaylistItemData | null>(null)
  const [currentTrackList, setCurrentTrackList] = createSignal<ITrackData[]>([])
  const [currentTrack, setCurrentTrack] = createSignal<ITrackData | null>(null)
  const [loopingState, setLoopingState] = createSignal<LoopingState>(LoopingState.NO_REPEAT)

  return {
    setCurrentPlaylist$: setCurrentPlaylist,
    currentTrackList$: currentTrackList,
    setCurrentTrackList$: setCurrentTrackList,
    loopingState$: loopingState,
    setLoopingState$: setLoopingState,
    currentTrack$: currentTrack,
    playTrack$(trackData: ITrackData) {
      if (import.meta.env.DEV) {
        console.assert(currentPlaylist() !== null, "currentPlaylist is null!!!")
      }
      setCurrentTrack(trackData)
      player.changeSource$(playlistTrackUrl(currentPlaylist()!.id, trackData.audioFile))
      player.play$()
    }
  }
}

export type TrackState = ReturnType<typeof createTrackState>