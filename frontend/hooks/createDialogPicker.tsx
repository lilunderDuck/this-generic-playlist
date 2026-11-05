import { css } from "molcss"
import { BsPlus } from "solid-icons/bs"
import { createSignal, Show } from "solid-js"
import { CODEC, PREVIEW_ROUTE, type OpenFileDialogParam } from "../api"
import { Tooltip } from "../components"

const dialog__inputWrap = css`
  background-color: var(--base);
  border-radius: 6px;
  outline: 4px dashed transparent;
  color: var(--subtext1);
  cursor: pointer;
  &:hover {
    outline-color: var(--sapphire);
    color: var(--text);
  }
`

const dialog__imageInput = css`
  & > div, & [data-corvu-tooltip-trigger] {
    width: 100%;
    height: 100%;
  }

  & [data-corvu-tooltip-trigger] {
    display: flex;
    justify-content: center;
    align-items: center;
    background: center center no-repeat var(--image-preview);
    background-size: contain;
  }
`

export function createDialogPicker(options: OpenFileDialogParam) {
  const [isPickingSomething, setIsPickingSomething] = createSignal(false)

  const pick = async() => {
    setIsPickingSomething(true)
    const filePath = await CODEC.openFileDialog$(options)
    setIsPickingSomething(false)
    console.log(filePath)
  }

  return {
    Input$: (props: { class$?: string }) => (
      <div class={`${dialog__imageInput} ${props.class$ ?? ""}`} onClick={pick}>
        <Show when={isPickingSomething()} fallback={
          <BsPlus size={30} />
        }>
          <></>
        </Show>
      </div>
    )
  }
}

export function createImageDialogPicker(options: Omit<OpenFileDialogParam, "filter">) {
  const [isPickingSomething, setIsPickingSomething] = createSignal(false)
  const [currentFilePath, setCurrentFilePath] = createSignal("")

  const pick = async() => {
    setIsPickingSomething(true)
    const filePath = await CODEC.openFileDialog$({
      filter: [{
        name: "Images file",
        patterns: ["*.png", "*.jpg", "*.svg", "*.gif", "*.bmp", "*.webp"]
      }],
      title: options.title
    })
    setIsPickingSomething(false)
    if (!filePath) return
    setCurrentFilePath(filePath.filePath)
  }

  return {
    Input$: (props: { class$?: string }) => (
      <div 
        class={`${dialog__inputWrap} ${dialog__imageInput} ${props.class$ ?? ""}`} 
        style={`--image-preview:url('${PREVIEW_ROUTE}${encodeURIComponent(currentFilePath())}')`} 
        onClick={pick}
      >
        <Tooltip label$="Click to choose image">
          <Show when={isPickingSomething()} fallback={
            <Show when={currentFilePath() === ""}>
              <BsPlus size={30} />
            </Show>
          }>
            <></>
          </Show>
        </Tooltip>
      </div>
    )
  }
}