import { BsPauseFill, BsPlayFill } from "solid-icons/bs"
import { Show } from "solid-js"
// ...
import { css } from "molcss"
import "./TrackItem.css"
// ...
import { playlistCoverIconUrl, type ITrackData } from "../../api"
import { header__authorWidth, header__durationWidth, header__indexWidth, header__nameWidth } from "./TrackHeader"
import { Author } from "./Author"
import { formatSecondsToMMSS } from "../../utils"
import { usePlaylistContext } from "../../provider"
import { MediaState } from "../../hooks"

const item__root = css`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  user-select: none;
  padding-inline: 20px;
  padding-block: 5px;
  border-radius: 6px;
  color: var(--subtext0);
`

const item__notCurrentTrack = css`
  &:hover {
    background-color: var(--base);
    color: var(--text);
  }

  & .trackItem__playIcon {
    display: none;
  }

  &[data-is-current-track=false]:hover .trackItem__playIcon {
    display: block;
  }

  &[data-is-current-track=false]:hover .trackItem__indexNumber {
    display: none;
  }
`

const item__currentTrack = css`
  background-color: var(--surface0);
  color: var(--text);
  &[data-is-current-track=true] .trackItem__indexNumber {
    display: none;
  }
`

const item__seperatorDummy = css`
  /* seperator width (5px) + flex gap (15px) */
  margin-right: 20px;
`

const item__coverIcon = css`
  width: 3rem;
  height: 3rem;
  border-radius: 6px;
  flex-shrink: 0;
`

const item__coverIconHasIcon = css`
  background: center center no-repeat var(--playlist-cover-icon-url);
  background-size: cover;
`

const item__coverIconEmpty = css`
  background-color: var(--base);
`

const item__trackNameWrap = css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 10px;
`

const item__trackItemIndex = css`
  font-size: 20px;
  display: flex;
  justify-content: center;
`

const item__authorNames = css`
  & > [data-corvu-tooltip-anchor] {
    display: inline-block;
  }
`

const item__playingAnimation = css`
  /* --size: 0.5px; */
  display: block;
  position: relative;
  &, &::before, &::after {
    width: 4px; /* calc(8 * var(--size)) */
    height: 20px; /* calc(40 * var(--size)) */
    border-radius: 6px;
    background: currentColor;
    color: var(--sky);
  }
  
  animation: playingAnimation 0.4s 0.5s linear infinite alternate;
  margin: 10px auto; /* calc(20 * var(--size)) */
  &::after, &::before {
    content: '';
    left: 10px; /* calc(20 * var(--size)) */
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    animation: playingAnimation 0.4s 0.65s linear infinite alternate;
  }

  &::before {
    left: -10px; /* calc(-20 * var(--size)) */
    animation-delay: 0s;
  }
`

const item__playingAnimationPaused = css`
  &, &::before, &::after {
    animation-play-state: paused;
  }
`

interface ITrackItemProps extends ITrackData {
  index$: number
  playlistId$: string
  onClickingThisItem$(): void
}

export function TrackItem(props: ITrackItemProps) {
  const { playlistState$, trackPlayer$ } = usePlaylistContext()

  const isCurrentTrack = () => playlistState$.currentTrack$()?.id === props.id
  
  const isCurrentTrackPaused = () => trackPlayer$.state$() === MediaState.PAUSED && isCurrentTrack()

  return (
    <div 
      class={`${item__root} ${isCurrentTrack() ? item__currentTrack : item__notCurrentTrack}`}
      data-is-current-track={isCurrentTrack()}
    >
      <div 
        class={`${header__indexWidth} ${item__seperatorDummy} ${item__trackItemIndex}`}
        onClick={props.onClickingThisItem$}
      >
        <span class="trackItem__indexNumber">
          {props.index$}
        </span>
        <Show when={isCurrentTrack()} fallback={
          <BsPlayFill size={35} class="trackItem__playIcon" />
        }>
          <span class={`${item__playingAnimation} ${isCurrentTrackPaused() ? item__playingAnimationPaused : ''}`}></span>
        </Show>
      </div>
      <div class={`${header__nameWidth} ${item__trackNameWrap}`}>
        <div 
          class={`${item__coverIcon} ${props.coverIconImage ? item__coverIconHasIcon : item__coverIconEmpty}`} 
          style={`--playlist-cover-icon-url:url('${playlistCoverIconUrl(props.playlistId$, props.coverIconImage!)}')`}
        />
        <p>{props.name}</p>
      </div>
      <div class={`${header__authorWidth} ${item__seperatorDummy} ${item__authorNames}`}>
        <Author info$={props.author} />
      </div>
      <div class={`${header__durationWidth}`}>
        {formatSecondsToMMSS(props.totalDuration)}
      </div>
    </div>
  )
}