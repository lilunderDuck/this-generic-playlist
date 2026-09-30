import { css } from "molcss"
import { playlistCoverIconUrl, type IPlaylistItemData } from "../../api"
import { Author } from "./Author"
import { BsPlayFill } from "solid-icons/bs"
import "./PlaylistItem.css"
import { Button, ButtonSize, Tooltip } from "../ui"
import { usePlaylistContext } from "../../provider"
import { A } from "@solidjs/router"

const item__root = css`
  width: 11.5rem;
  height: fit-content;
  padding: 0;
  text-align: center;
  user-select: none;
  text-align: left;
  outline: 4px solid transparent;
  border-radius: 6px;
  &:hover {
    outline-color: var(--sapphire);
  }
`

const item__coverIcon = css`
  width: 11.5rem;
  height: 11.5rem;
  border-radius: 6px;
  margin-bottom: 7px;
  position: relative;
`

const item__coverIconHasIcon = css`
  background: center center no-repeat var(--playlist-cover-icon-url);
  background-size: cover;
`

const item__coverIconEmpty = css`
  background-color: var(--base);
`

const item__nameWrap = css`
  padding-inline: 4px;
  padding-bottom: 5px;
`

const item__openDirectlyBtn = css`
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 5px;
  margin-bottom: 5px;
`

const item__playlistName = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 48px; /* !!HARDCODED PLAYLIST NAME HEIGHT HERE!! */
`

export function PlaylistItem(props: IPlaylistItemData) {
  const { setSidebarInfo$ } = usePlaylistContext()
  return (
    <Tooltip label$="Click to show playlist info" placement$="bottom">
      <div class={item__root} id="item_root" onClick={() => setSidebarInfo$(props)}>
        <div 
          class={`${item__coverIcon} ${props.coverIconImage ? item__coverIconHasIcon : item__coverIconEmpty}`}
          style={`--playlist-cover-icon-url:url('${playlistCoverIconUrl(props.id, props.coverIconImage!)}')`}
        >
          <Tooltip label$="Play this one">
            <A href={`/playlist/${props.id}`}>
              <Button size$={ButtonSize.ICON} class={item__openDirectlyBtn} id="item__openDirectlyBtn">
                <BsPlayFill size={27} />
              </Button>
            </A>
          </Tooltip>
        </div>
        <div class={item__nameWrap}>
          <h3 class={item__playlistName}>{props.name}</h3>
          <Author info$={props.author} onlyShowOneAuthor$={true} />
        </div>
      </div>
    </Tooltip>
  )
}