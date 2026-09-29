import { css } from "molcss"
import { BsCaretLeftFill, BsCaretRightFill, BsPauseFill, BsPlayFill } from "solid-icons/bs"
import { usePlaylistContext } from "../../../provider"
import { Button, ButtonSize, ButtonVariant, MediaProgressSlider, Tooltip } from "../../ui"
import { TrackLoopButton } from "./TrackLoopButton"
import { Show } from "solid-js"
import { MediaState } from "../../../hooks"
import { formatSecondsToMMSS } from "../../../utils"

const player__root = css`
  width: 100%;
  height: 6.65rem;
  background-color: var(--base);
  user-select: none;
`

const player__timeSeekingBar = css`
  padding-inline: 10px;
  padding-block: 5px;
  display: flex;
  gap: 10px;
`

const player__currentTime = css`
  font-size: 15px;
`

const player__controlsWrap = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 20px;
`

const player__controls = css`
  display: flex;
  align-items: center;
  gap: 15px;
`

const player__playButton = css`
  padding: 10px;
  border-radius: 60px;
  background-color: var(--base);
  &:hover {
    background-color: var(--surface0);
  }
  &:disabled {
    opacity: 0.7;
  }
`

export function TrackPlayer(props: { class?: string }) {
  const { trackPlayer$, playlistState$ } = usePlaylistContext()

  const togglePlaying = () => {
    if (trackPlayer$.state$() === MediaState.PLAYING) {
      trackPlayer$.pause$()
      return
    }

    trackPlayer$.play$()
  }

  const shouldDisable = () => playlistState$.currentTrack$() == null

  return (
    <section class={`${player__root} ${props.class ?? ''}`}>
      <div class={player__timeSeekingBar}>
        <div class={player__currentTime}>{formatSecondsToMMSS(trackPlayer$.currentProgress$())}</div>
        <MediaProgressSlider player$={trackPlayer$} disabled={shouldDisable()} />
        <div class={player__currentTime}>{formatSecondsToMMSS(trackPlayer$.totalDuration$())}</div>
      </div>
      <div class={player__controlsWrap}>
        <div>
          
        </div>
        <div class={player__controls}>
          <Tooltip label$="Go to previous track">
            <Button 
              variant$={ButtonVariant.NO_BACKGROUND} 
              size$={ButtonSize.ICON_LARGE} 
              disabled={shouldDisable()}
            >
              <BsCaretLeftFill size={25} />
            </Button>
          </Tooltip>
          <button 
            class={player__playButton} 
            onClick={togglePlaying} 
            disabled={shouldDisable()}
          >
            <Show when={trackPlayer$.state$() === MediaState.PLAYING} fallback={
              <BsPauseFill size={50} />
            }>
              <BsPlayFill size={50} />
            </Show>
          </button>
          <Tooltip label$="Go to next track">
            <Button 
              variant$={ButtonVariant.NO_BACKGROUND} 
              size$={ButtonSize.ICON_LARGE} 
              disabled={shouldDisable()}
            >
              <BsCaretRightFill size={25} />
            </Button>
          </Tooltip>
        </div>
        <div>
          <TrackLoopButton />
        </div>
      </div>
    </section>
  )
}