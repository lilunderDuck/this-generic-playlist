import { css } from "molcss"
import { BsPlus } from "solid-icons/bs"
import { createSignal, Show } from "solid-js"
import { CODEC, type OpenFileDialogParam } from "../api"

const dialog__imageInput = css`
  background-color: var(--base);
  border-radius: 6px;
  outline: 4px dashed transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--subtext1);
  &:hover {
    outline-color: var(--sapphire);
    color: var(--text);
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