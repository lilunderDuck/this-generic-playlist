import { Show } from "solid-js"
import type { IAuthorData } from "../../api"

export function Author(props: { info$?: IAuthorData }) {
  return (
    <Show when={props.info$}>
      <Show when={props.info$!.url} fallback={
        <p>{props.info$!.name}</p>
      }>
        <a href={props.info$!.url} target="_blank">{props.info$!.name}</a>
      </Show>
    </Show>
  )
}