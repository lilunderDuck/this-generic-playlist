import { createSignal } from "solid-js"
import { playlistTrackUrl, type IPlaylistItemData, type ITrackData } from "../api"
import type { MediaPlayer } from "../hooks"
import { duckDotLog, duckDotLogWithLabel } from "../utils"

export const enum LoopingState {
  REPEAT_ONCE = 0,
  REPEAT_PLAYLIST = 1,
  NO_REPEAT = 2,
}

export function createPlayerlistState(player: MediaPlayer<"audio">) {
  const [currentPlaylist, setCurrentPlaylist] = createSignal<IPlaylistItemData | null>(null)
  const [currentTrackList, setCurrentTrackList] = createSignal<ITrackData[]>([])
  const [currentTrack, setCurrentTrack] = createSignal<ITrackData | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = createSignal(0)
  const [loopingState, setLoopingState] = createSignal<LoopingState>(LoopingState.NO_REPEAT)

  player.onEnded$(() => tryPlayingNextTrack())

  const tryPlayingNextTrack = () => {
    const lastTrack = currentTrack()!
    if (import.meta.env.DEV) {
      console.assert(lastTrack !== null, "last track cannot be null!!")
    }

    if (loopingState() === LoopingState.REPEAT_ONCE) {
      playTrack(lastTrack, currentTrackIndex())
      return
    }

    const lastTrackIndex = currentTrackList().findIndex(it => it.id === lastTrack.id)
    const nextTrack = currentTrackList()[lastTrackIndex + 1]
    if (!nextTrack) {
      if (loopingState() === LoopingState.REPEAT_PLAYLIST) {
        const firstTrack = currentTrackList()[0]
        playTrack(firstTrack, 0)
        return
      }
      duckDotLogWithLabel("playlist", "there no track left to be played")
      return
    }

    playTrack(nextTrack, lastTrackIndex + 1)
  }

  const playTrack = (trackData: ITrackData, trackIndex: number) => {
    if (import.meta.env.DEV) {
      console.assert(currentPlaylist() !== null, "currentPlaylist is null!!!")
    }
    duckDotLogWithLabel('playlist', "Current track: ", trackData.name, "by", trackData.author?.name ?? "<unset>", "with duration of", trackData.totalDuration)
    setCurrentTrackIndex(trackIndex)
    setCurrentTrack(trackData)
    player.changeSource$(playlistTrackUrl(currentPlaylist()!.id, trackData.audioFile))
    player.play$()
  }

  return {
    syncData$(currentPlaylist: IPlaylistItemData, currentTracks: ITrackData[]) {
      setCurrentPlaylist(currentPlaylist)
      setCurrentTrackList(currentTracks)
      duckDotLogWithLabel("playlist", "synced all required data for", currentPlaylist.name)
    },
    currentTrackList$: currentTrackList,
    loopingState$: loopingState,
    setLoopingState$: setLoopingState,
    currentTrack$: currentTrack,
    playTrack$: playTrack
  }
}

export type PlayerlistState = ReturnType<typeof createPlayerlistState>