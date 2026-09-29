import { createEffect, createSignal, onCleanup } from "solid-js"
// ...
import { duckDotLogWithLabel, type AnyNoArgsFunction, type HTMLAttributes, type Ref } from "../utils" // documentation only
import { MediaProgressSlider } from "../components" // documentation only

type MediaPlayerProps<T extends "audio" | "video"> = Omit<
  HTMLAttributes<T>,
  "onProgress" | "onPlaying" | "onCanPlayThrough" | "onEnded" | "onTimeUpdate" |
  "ref" | "preload"
>

interface IMediaPlayerListener {
  onEnded$(): void
}

const enum MediaNetworkState {
	NETWORK_EMPTY = 0,
	NETWORK_IDLE = 1,
	NETWORK_LOADING = 2,
	NETWORK_NO_SOURCE = 3,
}

// oh god, how many time do I have to look at my mess here...
// I think I'm going insane

const ERROR_MESSAGE_MAPPING: Record<MediaNetworkState, string> = {
  [MediaNetworkState.NETWORK_EMPTY]: "NETWORK_EMPTY: there's no data yet.",
  [MediaNetworkState.NETWORK_IDLE]: "NETWORK_IDLE: the audio/video is currently not using the network.",
  [MediaNetworkState.NETWORK_LOADING]: "NETWORK_LOADING: current audio/video is still loading.",
  [MediaNetworkState.NETWORK_NO_SOURCE]: "NETWORK_NO_SOURCE: The audio/video is corrupted or in a unsupported format, or the src is not found.",
}

export const enum MediaState {
	LOADING = 0,
	PLAYING = 1,
	PAUSED = 2,
	ERROR = 3,
	COMPLETED = 4,
}

/**A hook for that abstracts raw HTML5 `<audio>` and `<video>` elements and handles 
 * media event states and a lot of black magic.
 * @param type      the type of media element, can be `"audio"` or `"video"`
 * @param listener  optional event listener to listen to some events, see {@link IMediaPlayerListener}
 * @see {@link MediaProgressSlider} - helper component to see the current progress of 
 * the media player and handle seeking.
 * @returns 
 */
export function createMediaPlayer<T extends "audio" | "video">(type: T) {
  const [mediaState, setMediaState] = createSignal(MediaState.LOADING)
  const [duration, setDuration] = createSignal(0)
  const [buffered, setBuffered] = createSignal(0)
  const [currentProgress, setCurrentProgress] = createSignal(0)
  const [currentVolume, setCurentVolume] = createSignal(100)

  console.assert(type == "audio" || type == "video", "invalid media player type:", type)

  // flag to make sure that the media player does not update
  // if we call changeCurrentTime(newTime, false /* don't update */)
  //
  // this is because if we have a slider and you try to drag it, the
  // current time will be flickering between the updated time and the current progress.
  let shouldUpdateCurrentTime = true

  if (import.meta.env.DEV) {
    const stateMapping: Record<MediaState, string> = {
      [MediaState.COMPLETED]: 'MediaState.COMPLETED',
      [MediaState.PLAYING]: 'MediaState.PLAYING',
      [MediaState.PAUSED]: 'MediaState.PAUSED',
      [MediaState.ERROR]: 'MediaState.ERROR',
      [MediaState.LOADING]: 'MediaState.LOADING',
    }

    createEffect(() => {
      duckDotLogWithLabel("state_transition", "player state changed to:", stateMapping[mediaState()])
    })
  }

  let onEndedCallback: AnyNoArgsFunction | undefined = undefined
  let mediaRef!: Ref<T>
  let detailErrorMessage = ""
  const mediaProps: HTMLAttributes<T> = {
    preload: "metadata",
    onLoadedData() {
      setMediaState(MediaState.LOADING)
    },
    onPlaying() {
      setMediaState(MediaState.PLAYING)
    },
    onCanPlayThrough() {
      console.assert(mediaRef !== undefined, "accessing mediaRef too early!!")

      if (mediaRef.paused) {
        setMediaState(MediaState.PAUSED)
      }

      setDuration(mediaRef.duration)
      duckDotLogWithLabel("player", "total duraction updated, duration:", mediaRef.duration, "seconds")
    },
    onEnded() {
      if (onEndedCallback) {
        onEndedCallback()
      }
      setMediaState(MediaState.COMPLETED)
    },
    onError() {
      console.assert(mediaRef !== undefined, "NullPointerException: accessing mediaRef too early!!")
      duckDotLogWithLabel("player", `ERROR DURING MOD, I mean... ${type}... LOADING\n`, "networkState:", mediaRef.networkState)

      detailErrorMessage = ERROR_MESSAGE_MAPPING[mediaRef.networkState as MediaNetworkState]
      console.assert(detailErrorMessage !== undefined, "could not get the detail error message for networkState", mediaRef.networkState, ", case is not being handled or invalid.")

      setMediaState(MediaState.ERROR)
    },
    onTimeUpdate() {
      const currentMediaTime = mediaRef.currentTime

      if (shouldUpdateCurrentTime) {
        setCurrentProgress(currentMediaTime)
      } else {
        duckDotLogWithLabel("player", "current time won't be updated")
      }

      const duration = mediaRef.duration
      const buffered = mediaRef.buffered
      if (duration <= 0) return

      for (let i = 0; i < buffered.length; i++) {
        if (buffered.start(buffered.length - 1 - i) < currentMediaTime) {
          const bufferedProgress = (mediaRef.buffered.end(mediaRef.buffered.length - 1 - i) * 100) / duration
          setBuffered(bufferedProgress)
          break
        }
      }
    }
  }

  const pause = () => {
    console.assert(mediaRef !== undefined, "accessing mediaRef too early!!")

    mediaRef.pause()
    setMediaState(MediaState.PAUSED)
    duckDotLogWithLabel("player", "paused", mediaRef.src)
  }

  const changeSource = (src: string) => {
    console.assert(mediaRef !== undefined, "accessing mediaRef too early!!")

    setMediaState(MediaState.LOADING)
    mediaRef.src = src
    setCurrentProgress(0)

    duckDotLogWithLabel("player", "source changed:", src)
  }

  const play = () => {
    console.assert(mediaRef !== undefined, "accessing mediaRef too early!!")

    const isEnded = currentProgress() === duration()
    if (isEnded) {
      duckDotLogWithLabel("player", "detected that the media has finished playing, resetting current progress back to 0")
      setCurrentProgress(0)
    }
    mediaRef.currentTime = currentProgress()

    if (mediaRef.readyState >= 3) {
      tryPlayingThis()
      return
    }
  
    duckDotLogWithLabel("player", "media not ready!! waiting for 'canplay' event...")
    const handleCanPlay = async () => {
      duckDotLogWithLabel("player", "GOT 'canplay' signal, attempting to play now")
      mediaRef.removeEventListener("canplay", handleCanPlay)
      await tryPlayingThis()
    }
    
    mediaRef.addEventListener("canplay", handleCanPlay)
  }

  const tryPlayingThis = async () => {
    try {
      await mediaRef.play()
      duckDotLogWithLabel("player", "playing", mediaRef.src)
    } catch (error: any) {
      if (error.name === "AbortError") {
        duckDotLogWithLabel("player", "play request safely aborted by a newer load request.")
        return
      }

      duckDotLogWithLabel("player", error)
    }
  }

  const changeVolume = (volume: number) => {
    console.assert(!isNaN(volume), "volume is not a number")
    console.assert(volume >= 0 && volume <= 100, "volume must not be negative and must not over 100. Your current volume is:", volume)

    mediaRef.volume = volume / 100
    setCurentVolume(volume)

    duckDotLogWithLabel("player", "volume changed to:", volume)
  }

  const changeCurrentTime = (time: number, update = true) => {
    if (time < 0) {
      duckDotLogWithLabel("player", "provided a negative time", time, "seconds, falling back to", 0, "second.")
      time = 0
    }

    setCurrentProgress(time)
    shouldUpdateCurrentTime = update
    if (update) {
      mediaRef.currentTime = time
      duckDotLogWithLabel("player", "current time changed to", time, "seconds")
    }
  }

  const isMuted = () => currentVolume() === 0

  const toggleMute = () => {
    setCurentVolume(isMuted() ? 100 : 0)
    mediaRef.muted = isMuted()
    duckDotLogWithLabel("player", "muted:", isMuted())
  }

  onCleanup(() => {
    duckDotLogWithLabel("player", "cleaning up...")
    // @ts-ignore
    mediaRef = null
  })

  return {
    onEnded$(callback: AnyNoArgsFunction) {
      onEndedCallback = callback
    },
    /**The current state of the media player. All possible state can be:
     * ```
     * MediaState.LOADING
     * MediaState.PLAYING
     * MediaState.PAUSED
     * MediaState.ERROR
     * MediaState.COMPLETED
     * ```
     */
    state$: mediaState,
    /**The total length of the current media file in seconds. */
    totalDuration$: duration,
    /**The buffered (downloaded) **in percentage** of the media file, from `0` to `100`. */
    bufferedProgress$: buffered,
    /**The current playback timestamp of the media file in seconds. */
    currentProgress$: currentProgress,
    /**Changes the current playback timestamp.
     * @param time    the new timestamp in seconds.
     * @param update  set to `false` during slider dragging to temporarily prevent updating current media time.
     */
    changeCurrentTime$: changeCurrentTime,
    /**Pauses the current media player */
    pause$: pause,
    /**Plays/Resumes media playback */
    play$: play,
    /**Sets the media volume.
     * @param volume A value from `0` (muted) to `100` (full volume).
     */
    setVolume$: changeVolume,
    /**Switches the media player source URL and resets current progress.
     * @param src the URL of the new audio or video file.
     */
    changeSource$: changeSource,
    /**Gets the direct underlying HTML5 `<audio>` or `<video>` element reference. */
    ref$: () => mediaRef,
    /**Gets the current volume level. */
    volume$: currentVolume,
    /**Reactive boolean indicating whether the player is currently muted. */
    isMuted$: isMuted,
    /**Toggles the media player to be muted. */
    toggleMute$: toggleMute,
    /**Gets the detailed error message if `state$` enters `MediaState.ERROR` state.*/
    errorMessage$: () => detailErrorMessage,
    /**The SolidJS JSX Component wrapper. Automatically handles DOM references and binding event listeners.
     * @example
     * ```tsx
     * const player = createMediaPlayer("video")
     * // ... do something with the player ...
     * 
     * <player.Player$ src="video.mp4" class="my-video-style" />
     * ```
     */
    Player$: (props: MediaPlayerProps<T>) => (
      type == "audio" ?
        // @ts-ignore
        <audio ref={mediaRef} {...props} {...mediaProps} /> :
        // @ts-ignore
        <video ref={mediaRef} {...props} {...mediaProps} />
    )
  }
}

export type MediaPlayer<T extends "audio" | "video"> = ReturnType<typeof createMediaPlayer<T>>