import { css } from "molcss"
import { BsPlus, BsX } from "solid-icons/bs"
import { createEffect, createSignal, For, Show } from "solid-js"
// ...
import { Button, ButtonVariant } from "../../ui"
import type { IAuthorData } from "../../../api"
import { createInputState } from "./inputState"

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

const input__noAuthorLinkText = css`
  color: var(--subtext1);
`

const input__errorMessageText = css`
  color: var(--red);
  padding-left: 10px;
  margin-block: 10px;
`

interface IPlaylistAuthorInputProps {
  onChange$(data: IAuthorData[]): any
}

const ERR_INVALID_AUTHOR_URL = "The link you're provided is not a valid URL"
const ERR_INVALID_AUTHOR_NAME = "The author name should not be left empty."

export function PlaylistAuthorInput(props: IPlaylistAuthorInputProps) {
  const [authorData, setAuthorData] = createSignal<IAuthorData[]>([])
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null)

  const authorNameInput = createInputState<IAuthorData["name"]>({
    initialValue$: "",
    placeholder$: "Author name",
    onError$: setErrorMessage,
    onErrorReset$: () => onResetError(),
    onValidate$(authorName) {
      if(authorName.trim() === "") return ERR_INVALID_AUTHOR_NAME
      return null
    },
  })

  const authorLinkInput = createInputState<IAuthorData["url"]>({
    initialValue$: "",
    placeholder$: "Author url",
    onError$: setErrorMessage,
    onErrorReset$: () => onResetError(),
    onValidate$(authorUrl) {
      if (authorUrl && !URL.canParse(authorUrl)) return ERR_INVALID_AUTHOR_URL
      return null
    },
  })

  const tryAddingItem = () => {
    if (!authorNameInput.tryValidate$()) return
    if (!authorLinkInput.tryValidate$()) return

    let authorUrl: string | undefined = authorLinkInput.currentValue$()
    if (authorUrl === '') {
      authorUrl = undefined
    }

    const currentData: IAuthorData = {
      name: authorNameInput.currentValue$(),
      url: authorUrl,
    }

    if (isThisContainDuplicate(currentData)) {
      return showThatTheresADuplicate()
    }

    setAuthorData(prev => [...prev, currentData])

    authorNameInput.clear$()
    authorLinkInput.clear$()
  }

  const highlightAllInput = (state: boolean) => {
    authorNameInput.highlightInput$(state)
    authorLinkInput.highlightInput$(state)
  }

  const onResetError = () => {
    highlightAllInput(false)
    setErrorMessage(null)
  }

  const showThatTheresADuplicate = () => {
    highlightAllInput(true)
    setErrorMessage("There might be an item just like the one you tried to add.")
  }

  const isThisContainDuplicate = (target: IAuthorData) => {
    for (const data of authorData()) {
      if (
        data.name === target.name &&
        data.url === target.url
      ) return true
    }

    return false
  }

  const removeItem = (currentData: IAuthorData) => {
    if (authorData().length === 1) {
      setAuthorData([])
      return
    }
    setAuthorData(prev => [...prev.filter(it => {
      const isContainAuthorUrl = it.url && currentData.url && it.url === currentData.url
      if (isContainAuthorUrl) {
        return it.name !== currentData.name && it.url !== currentData.url
      }

      return it.name !== currentData.name
    })])
  }

  createEffect(() => {
    props.onChange$(authorData())
  })

  return (
    <div class={input__root}>
      <Show when={authorData().length === 0} fallback={
        <For each={authorData()}>
          {it => (
            <div class={`${input__item} ${input__authorItem} ${input__buttonFix}`}>
              <div>
                {it.name}
              </div>
              <div class={input__linkItem}>
                <Show when={it.url} fallback={
                  <span class={input__noAuthorLinkText}>[No author url]</span>
                }>
                  <a href={it.url}>{it.url}</a>
                </Show>
              </div>
              <Button variant$={ButtonVariant.DANGER} onClick={() => removeItem(it)}>
                <BsX />
                Remove
              </Button>
            </div>
          )}
        </For>
      }>
        <div class={input__noAuthorIndicator}>
          No author right now, you should try adding some authors
        </div>
      </Show>
      <div class={input__divider} />
      <div class={`${input__item} ${input__wrap} ${input__buttonFix}`}>
        <authorNameInput.Input$ />
        <authorLinkInput.Input$ />
        <Button onClick={tryAddingItem} disabled={authorNameInput.currentValue$() === ""}>
          <BsPlus />
          Add
        </Button>
      </div>
      <Show when={errorMessage()}>
        <div class={input__errorMessageText}>
          {errorMessage()}
        </div>
      </Show>
    </div>
  )
}