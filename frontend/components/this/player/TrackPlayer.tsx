import { css } from "molcss"
import { BsCaretLeftFill, BsCaretRightFill, BsPauseFill, BsPlayFill } from "solid-icons/bs"
import { usePlaylistContext } from "../../../provider"
import { Button, ButtonSize, ButtonVariant, MediaProgressSlider, Spacer, Tooltip } from "../../ui"
import { TrackLoopButton } from "./TrackLoopButton"
import { Show } from "solid-js"
import { MediaState } from "../../../hooks"
import { formatSecondsToMMSS } from "../../../utils"
import { playlistCoverIconUrl, playlistTrackUrl } from "../../../api"
import { Author } from "../Author"
import { useLocation } from "@solidjs/router"

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
  width: 4.5rem;
  text-align: center;
`

const player__controlsWrap = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  padding-inline: 10px;
`

const player__controls = css`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
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

const player__coverIcon = css`
  width: 4rem;
  height: 4rem;
  border-radius: 6px;
  flex-shrink: 0;
`

const player__coverIconHasIcon = css`
  background: center center no-repeat var(--playlist-cover-icon-url);
  background-size: cover;
`

const player__coverIconEmpty = css`
  background-color: var(--base);
`

const player__currentTrackInfo = css`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`

const player__buttonRowRightSide = css`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
`

const player__currentlyPlayedTrackName = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export function TrackPlayer(props: { class?: string }) {
  const { trackPlayer$, playlistState$, sidebarInfo$ } = usePlaylistContext()
  const location = useLocation()

  const togglePlaying = () => {
    if (trackPlayer$.state$() === MediaState.PLAYING) {
      trackPlayer$.pause$()
      return
    }

    trackPlayer$.play$()
  }

  const shouldDisable = () => playlistState$.currentTrack$() == null || trackPlayer$.state$() == MediaState.LOADING
  const shouldHideAuthors = () => location.pathname === '/' && sidebarInfo$() !== null

  return (
    <section class={`${player__root} ${props.class ?? ''}`}>
      <div class={player__timeSeekingBar}>
        <div class={player__currentTime}>{formatSecondsToMMSS(trackPlayer$.currentProgress$())}</div>
        <MediaProgressSlider player$={trackPlayer$} disabled={shouldDisable()} />
        <div class={player__currentTime}>{formatSecondsToMMSS(trackPlayer$.totalDuration$())}</div>
      </div>
      <div class={player__controlsWrap}>
        <div class={player__currentTrackInfo}>
          <Show when={playlistState$.currentTrack$()?.coverIconImage}>
            <div class={`${player__coverIcon} ${playlistState$.currentTrack$()?.coverIconImage ? player__coverIconHasIcon : player__coverIconEmpty}`} style={`--playlist-cover-icon-url:url('${playlistCoverIconUrl(playlistState$.currentPlaylist$()!.id, playlistState$.currentTrack$()!.coverIconImage!)}')`} />
            <div>
              <h3 class={player__currentlyPlayedTrackName}>
                {playlistState$.currentTrack$()?.name}
              </h3>
              <Author 
                info$={playlistState$.currentTrack$()?.author} 
                onlyShowOneAuthor$={shouldHideAuthors()} 
              />
            </div>
          </Show>
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
        <div class={player__buttonRowRightSide}>
          <Spacer />
          <TrackLoopButton />
        </div>
      </div>
    </section>
  )
}