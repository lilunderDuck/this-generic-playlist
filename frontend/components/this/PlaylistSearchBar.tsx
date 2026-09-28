import { css } from "molcss"

const searchBar__root = css`
  background-color: var(--mantle);
  padding-inline: 10px;
  padding-block: 5px;
  font-size: 17px;
  width: 50%;
`

export function PlaylistSearchBar() {
  return (
    <input class={searchBar__root} placeholder="Search your playlist" />
  )
}