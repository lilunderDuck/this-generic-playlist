import { css } from "molcss"
import type { HTMLAttributes } from "../../utils"

const input__root = css`
  background-color: var(--base);
  padding-inline: 10px;
  padding-block: 5px;
  width: 100%;
  font-size: inherit;
`

export function Input(props: HTMLAttributes<"input">) {
  return (
    <input class={`${input__root} ${props.class ?? ""}`} {...props} />
  )
}