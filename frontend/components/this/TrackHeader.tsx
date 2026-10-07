import { css } from "molcss"

const header__root = css`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  user-select: none;
  padding-inline: 20px;
  padding-block: 7px;
  background-color: var(--mantle);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  position: sticky;
  top: 0;
`

export const header__indexWidth = css`
  width: 3rem;
`

const header__index = css`
  text-align: center;
`

export const header__nameWidth = css`
  width: 40%;
`

export const header__authorWidth = css`
  width: 28%;
`

export const header__durationWidth = css`
  width: 15%;
`

const header__seperator = css`
  width: 5px;
  height: 25px;
  border-radius: 6px;
  background-color: var(--surface0);
  flex-shrink: 0;
`

export function TrackHeader() {
  return (
    <header class={header__root}>
      <div class={`${header__indexWidth} ${header__index}`}>#</div>
      <div class={header__seperator} />
      <div class={header__nameWidth}>Name</div>
      <div class={header__seperator} />
      <div class={header__authorWidth}>Author</div>
      <div class={header__seperator} />
      <div class={header__durationWidth}>Duration</div>
    </header>
  )
}