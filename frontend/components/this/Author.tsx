import { Show } from "solid-js"
import type { IAuthorData } from "../../api"
import { css } from "molcss"

const item__authors = css`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
`

export function Author(props: { info$?: IAuthorData }) {
  return (
    <Show when={props.info$}>
      <Show when={props.info$!.url} fallback={
        <p class={item__authors}>{props.info$!.name}</p>
      }>
        <a href={props.info$!.url} target="_blank">{props.info$!.name}</a>
      </Show>
    </Show>
  )
}