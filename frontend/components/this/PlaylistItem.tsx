import { css } from "molcss"
import { playlistCoverIconUrl, type IPlaylistItemData } from "../../api"
import { Show } from "solid-js"
import { Author } from "./Author"

const item__root = css`
  width: 11.5rem;
  height: fit-content;
  padding: 0;
  text-align: center;
  user-select: none;
  text-align: left;
`

const item__coverIcon = css`
  width: 11.5rem;
  height: 11.5rem;
  border-radius: 6px;
  margin-bottom: 7px;
`

const item__coverIconHasIcon = css`
  background: center center no-repeat var(--playlist-cover-icon-url);
  background-size: cover;
`

const item__coverIconEmpty = css`
  background-color: var(--base);
`

const item__authors = css`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
`

export function PlaylistItem(props: IPlaylistItemData) {
  return (
    <button class={item__root}>
      <div 
        class={`${item__coverIcon} ${props.coverIconImage ? item__coverIconHasIcon : item__coverIconEmpty}`}
        style={`--playlist-cover-icon-url:url('${playlistCoverIconUrl(props.id, props.coverIconImage!)}')`}
      >
      </div>
      <h3>{props.name}</h3>
      <Author info$={props.author} />
    </button>
  )
}