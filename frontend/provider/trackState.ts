import { createSignal } from "solid-js"
import { playlistTrackUrl, type IPlaylistItemData, type ITrackData } from "../api"
import type { MediaPlayer } from "../hooks"
import { duckDotLogWithLabel } from "../utils"

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
      player.play$()
      return
    }

    const lastTrackIndex = getIndexForTrack(lastTrack)
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

  const getIndexForTrack = (track: ITrackData) => (
    currentTrackList().findIndex(it => it.id === track.id)
  )

  const playTrack = (trackData: ITrackData, trackIndex: number) => {
    if (import.meta.env.DEV) {
      console.assert(currentPlaylist() !== null, "currentPlaylist is null!!!")
    }
    duckDotLogWithLabel('playlist', "Current track: ", trackData.name, "by", trackData.author ?? "<unset>", "with duration of", trackData.totalDuration)
    setCurrentTrackIndex(trackIndex)
    setCurrentTrack(trackData)
    player.changeSource$(playlistTrackUrl(currentPlaylist()!.id, trackData.audioFile))
    player.play$()
  }

  return {
    syncData$(playlist: IPlaylistItemData, currentTracks: ITrackData[]) {
      duckDotLogWithLabel("state transition", "PLAYLIST_RESYNC for:", playlist.name)
      setCurrentPlaylist(playlist)
      setCurrentTrackList(currentTracks)
    },
    goToNextTrack$() {
      if (!currentTrack()) return
      duckDotLogWithLabel("state transition", "NEXT_TRACK")
      const nextTrackIndex = getIndexForTrack(currentTrack()!) + 1
      const nextTrack = currentTrackList()[nextTrackIndex]
      playTrack(nextTrack, nextTrackIndex)
    },
    goToPrevTrack$() {
      if (!currentTrack()) return
      duckDotLogWithLabel("state transition", "PREV_TRACK")
      const lastTrackIndex = getIndexForTrack(currentTrack()!) - 1
      const lastTrack = currentTrackList()[lastTrackIndex]
      playTrack(lastTrack, lastTrackIndex)
    },
    currentTrackIndex$: currentTrackIndex,
    currentPlaylist$: currentPlaylist,
    currentTrackList$: currentTrackList,
    loopingState$: loopingState,
    setLoopingState$: setLoopingState,
    currentTrack$: currentTrack,
    playTrack$: playTrack
  }
}

export type PlayerlistState = ReturnType<typeof createPlayerlistState>