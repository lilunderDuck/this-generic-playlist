import { For, Show } from "solid-js"
import { css } from "molcss"
import type { IAuthorData } from "../../api"
import { Tooltip } from "../ui"

const item__root = css`
  display: flex; 
  align-items: center;
  gap: 5px;
`

const item__authors = css`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  display: inline;
`

const item__moreAuthorCount = css`
  padding-inline: 10px;
  border-radius: 6px;
  background-color: var(--surface0);
  width: fit-content;
  &:hover {
    text-decoration: underline;
  }
`

interface IAuthorProps {
  class?: string
  info$?: IAuthorData[]
  onlyShowOneAuthor$?: boolean
  limit$?: number
}

export function Author(props: IAuthorProps) {
  return (
    <Show when={props.info$}>
      <Show when={props.onlyShowOneAuthor$} fallback={
        <RenderAuthorWithLimit info$={props.info$!} limit$={5} />
      }>
        <div class={`${item__root} ${props.class ?? ""}`}>
          <RenderAuthorWithLimit info$={props.info$!} limit$={1} />
        </div>
      </Show>
    </Show>
  )
}

function RenderAuthorWithLimit(props: { info$: IAuthorData[], limit$: number }) {
  const authorListCut = () => props.info$.slice(0, props.limit$)

  return (
    <>
      <RenderAuthorList list$={authorListCut()} omitAndSeperator$={props.info$.length < props.limit$} />
      <Show when={props.info$!.length > props.limit$}>
        <Tooltip label$={<RenderAuthorList list$={props.info$!} />}>
          <div class={item__moreAuthorCount}>
            +{props.info$!.length - 1}
          </div>
        </Tooltip>
      </Show>
    </>
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

function RenderAuthorList(props: { list$: IAuthorData[], omitAndSeperator$?: boolean }) {
  return (
    <For each={props.list$}>
      {(it, index) => (
        <>
          <RenderAuthorNameText {...it} />
          <Show when={index() !== props.list$.length - 1}>
            <Show when={index() === props.list$.length - 2 && props.omitAndSeperator$} fallback={", "}>
              {" and "}
            </Show>
          </Show>
        </>
      )}
    </For>
  )
}