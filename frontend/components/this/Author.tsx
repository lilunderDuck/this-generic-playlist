import { For, Show } from "solid-js"
import { css } from "molcss"
import type { IAuthorData } from "../../api"
import { Spacer } from "../ui"

const item__root = css`
  display: flex; 
  align-items: center;
  gap: 5px;
  overflow-x: hidden;
  text-overflow: ellipsis;
`

const item__authors = css`
  white-space: nowrap;
`

const item__moreAuthorCount = css`
  padding-inline: 10px;
  border-radius: 6px;
  background-color: var(--surface0);
`

interface IAuthorProps {
  class?: string
  info$?: IAuthorData[]
  onlyShowOneAuthor$?: boolean
}

export function Author(props: IAuthorProps) {
  return (
    <Show when={props.info$}>
      <Show when={props.onlyShowOneAuthor$} fallback={
        <For each={props.info$}>
          {(it, index) => (
            <>
              <RenderAuthorNameText {...it} />
              <Show when={index() !== props.info$!.length - 1}>
                {", "}
              </Show>
            </>
          )}
        </For>
      }>
        <div class={`${item__root} ${props.class ?? ""}`}>
          <RenderAuthorNameText {...props.info$![0]} />
          <Show when={props.info$!.length > 1}>
            <Spacer />
            <div class={item__moreAuthorCount}>
              +{props.info$!.length - 1}
            </div>
          </Show>
        </div>
      </Show>
    </Show>
  )
}

function RenderAuthorNameText(props: IAuthorData) {
  return (
    <Show when={props.url} fallback={
      <p class={item__authors}>{props.name}</p>
    }>
      <a href={props.url} target="_blank">{props.name}</a>
    </Show>
  )
}