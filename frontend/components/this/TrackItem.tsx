import { css } from "molcss"
import { playlistCoverIconUrl, type ITrackData } from "../../api"
import { header__authorWidth, header__durationWidth, header__indexWidth, header__nameWidth } from "./TrackHeader"
import { Author } from "./Author"
import { formatSecondsToMMSS } from "../../utils"
import { usePlaylistContext } from "../../provider"

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
`

const item__currentTrack = css`
  background-color: var(--surface0);
  color: var(--text);
`

const item__seperatorDummy = css`
  /* seperator width (5px) + flex gap (15px) */
  margin-right: 20px;
`

const item__coverIcon = css`
  width: 3rem;
  height: 3rem;
  border-radius: 6px;
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
  text-align: center;
  font-size: 20px;
`

interface ITrackItemProps extends ITrackData {
  index$: number
  playlistId$: string
}

export function TrackItem(props: ITrackItemProps) {
  const { playlistState$ } = usePlaylistContext()

  const isCurrentTrack = () => playlistState$.currentTrack$()?.id === props.id

  return (
    <div 
      class={`${item__root} ${isCurrentTrack() ? item__currentTrack : item__notCurrentTrack}`}
      data-is-current-track={isCurrentTrack()}
    >
      <div 
        class={`${header__indexWidth} ${item__seperatorDummy} ${item__trackItemIndex}`}
        onClick={() => playlistState$.playTrack$(props, props.index$)}
      >
        {props.index$}
      </div>
      <div class={`${header__nameWidth} ${item__trackNameWrap}`}>
        <div 
          class={`${item__coverIcon} ${props.coverIconImage ? item__coverIconHasIcon : item__coverIconEmpty}`} 
          style={`--playlist-cover-icon-url:url('${playlistCoverIconUrl(props.playlistId$, props.coverIconImage!)}')`}
        />
        <p>{props.name}</p>
      </div>
      <div class={`${header__authorWidth} ${item__seperatorDummy}`}>
        <Author info$={props.author} />
      </div>
      <div class={`${header__durationWidth}`}>
        {formatSecondsToMMSS(props.totalDuration)}
      </div>
    </div>
  )
}