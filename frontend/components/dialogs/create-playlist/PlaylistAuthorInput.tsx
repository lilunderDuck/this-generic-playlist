import { css } from "molcss"
import { Button, ButtonVariant, Input } from "../../ui"
import { BsDash, BsPlus, BsX } from "solid-icons/bs"

const input__root = css`
  padding-inline: 10px;
  padding-block: 5px;
  background-color: var(--mantle);
`

const input__noAuthorIndicator = css`
  padding-block: 1rem;
  text-align: center;
  color: var(--subtext0);
`

const input__item = css`
  gap: 10px;
  display: grid;
  grid-template-columns: 1fr 2fr 0.5fr;
`

const input__wrap = css`
  width: 100%;
  margin-top: 20px;
`

const input__buttonFix = css`
  & > button {
    gap: 15px;
  }

  & svg {
    flex-shrink: 0;
  }
`

const input__authorItem = css`
  display: flex;
  width: 100%;
  gap: 10px;
  padding-inline: 10px;
  padding-block: 5px;
  border-radius: 6px;
  &:hover {
    background-color: var(--surface0);
  }

  & button {
    opacity: 0;
  }

  &:hover button {
    opacity: 1;
  }
`

const input__linkItem = css`
  margin-left: 20px;
`

const input__divider = css`
  width: calc(100% - 2 * 15px);
  height: 6px;
  border-radius: 6px;
  background-color: var(--surface1);
  margin-inline: 15px;
  margin-block: 10px;
`

export function PlaylistAuthorInput() {
  return (
    <div class={input__root}>
      <div class={input__noAuthorIndicator}>
        No author right now, you should try adding some authors
      </div>
      {/* <div class={`${input__item} ${input__authorItem} ${input__buttonFix}`}>
        <div>Something</div>
        <div class={input__linkItem}>Something</div>
        <Button variant$={ButtonVariant.DANGER}>
          <BsX />
          Remove
        </Button>
      </div> */}
      <div class={input__divider} />
      <div class={`${input__item} ${input__wrap} ${input__buttonFix}`}>
        <Input autocomplete="off" placeholder="Author name" />
        <Input autocomplete="off" placeholder="Author link" />
        <Button>
          <BsPlus />
          Add
        </Button>
      </div>
    </div>
  )
}