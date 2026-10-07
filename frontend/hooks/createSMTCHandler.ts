import { onCleanup } from "solid-js"
// ...
import { playlistCoverIconUrl, type IPlaylistItemData, type ITrackData } from "../api"
import type { MediaPlayer } from "./media"
import { duckDotLogWithLabel } from "../utils"

/**This is a hook allowing you to 
 * manage media playback across running applications via system overlay.
 * 
 * The name `SMTC` is a shorthand for [`Windows System Media Transport Controls`](https://learn.microsoft.com/en-us/windows/apps/develop/media-playback/system-media-transport-controls)
 * 
 * However, it should works in any operation system (not sure what
 * it called in linux or macOS).
 */
export function createSMTCHandlers(options: {
  player$: MediaPlayer<"audio"> | MediaPlayer<"video">
  nextTrackHandler$: MediaSessionActionHandler
  previousTrackHandler$: MediaSessionActionHandler
}) {
  const supportSetActionHandler = navigator.mediaSession.setActionHandler !== undefined
  const supportSettingMetadata = navigator.mediaSession.metadata !== undefined
  if (import.meta.env.DEV) {
    duckDotLogWithLabel('debug', "\n",
      "- Does your browser support mediaSession.setActionHandler()?", supportSetActionHandler, "\n",
      "- Does your brwoser support mediaSession.metadata?", supportSettingMetadata
    )
  }

  if (supportSetActionHandler) {
    // since we don't bind "this" to something else, it just works
    navigator.mediaSession.setActionHandler("play", options.player$.play$)
    navigator.mediaSession.setActionHandler("pause", options.player$.pause$)
    navigator.mediaSession.setActionHandler("nexttrack", options.nextTrackHandler$)
    navigator.mediaSession.setActionHandler("previoustrack", options.previousTrackHandler$)
  } else {
    console.warn("your browser does not have a support for some of the MediaSession api, some functionality won't work")
  }

  // avoid object creation, we can pre-create MediaMetadata then reuse it later
  // weird hack alert start here
  const NO_ARTWORK_REF = [] as MediaMetadata["artwork"]
  let cachedMetadata = new MediaMetadata({
    album: "",
    artist: "",
    artwork: [],
    title: ""
  })

  let cachedArtworkMetadata: MediaMetadata["artwork"] = [
    { src: "" }
  ]

  onCleanup(() => {
    if (supportSetActionHandler) {
      navigator.mediaSession.setActionHandler("play", null)
      navigator.mediaSession.setActionHandler("pause", null)
      navigator.mediaSession.setActionHandler("nexttrack", null)
      navigator.mediaSession.setActionHandler("previoustrack", null)
    }

    if (supportSettingMetadata) {
      navigator.mediaSession.metadata = null
    }
    // @ts-ignore - explicit free
    cachedMetadata = null
  })

  return {
    changeMetadata$(currentPlaylist: IPlaylistItemData, currentTrack: ITrackData) {
      if (!supportSettingMetadata) return

      cachedMetadata.album = currentPlaylist.name
      cachedMetadata.title = currentTrack.name
      cachedMetadata.artist = currentPlaylist.author?.map(it => it.name).join(", ") ?? ""

      if (currentTrack.coverIconImage) {
        cachedArtworkMetadata[0].src = playlistCoverIconUrl(currentPlaylist.id, currentTrack.coverIconImage)
        cachedMetadata.artwork = cachedArtworkMetadata 
      } else {
        cachedMetadata.artwork = NO_ARTWORK_REF
      }
      
      navigator.mediaSession.metadata = cachedMetadata
    }
  }
}