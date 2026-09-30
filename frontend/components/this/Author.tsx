import { For, Show } from "solid-js"
import { css } from "molcss"
import type { IAuthorData } from "../../api"
import { Spacer, Tooltip } from "../ui"

const item__root = css`
  display: flex; 
  align-items: center;
  gap: 5px;
`

const item__authors = css`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
`

const item__moreAuthorCount = css`
  padding-inline: 10px;
  border-radius: 6px;
  background-color: var(--surface0);
  &:hover {
    text-decoration: underline;
  }
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
        <RenderAuthorList list$={props.info$!} />
      }>
        <div class={`${item__root} ${props.class ?? ""}`}>
          <RenderAuthorNameText {...props.info$![0]} />
          <Show when={props.info$!.length > 1}>
            <Tooltip label$={<RenderAuthorList list$={props.info$!} />}>
              <div class={item__moreAuthorCount}>
                +{props.info$!.length - 1}
              </div>
            </Tooltip>
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
      <a class={item__authors} href={props.url} target="_blank">{props.name}</a>
    </Show>
  )
}

function RenderAuthorList(props: { list$: IAuthorData[] }) {
  return (
    <For each={props.list$}>
      {(it, index) => (
        <>
          <RenderAuthorNameText {...it} />
          <Show when={index() !== props.list$.length - 1}>
            <Show when={index() === props.list$.length - 2} fallback={", "}>
              {" and "}
            </Show>
          </Show>
        </>
      )}
    </For>
  )
}