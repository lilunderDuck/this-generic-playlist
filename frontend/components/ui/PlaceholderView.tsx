import { css } from "molcss"
// ...
import type { JSX, ParentProps } from "solid-js"

const placeholderView = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 20px;
  user-select: none;
`

const placeholderView__text = css`
  max-width: 50%;
  text-align: center;
`

interface IPlaceholderViewProps {
  icons$: JSX.Element
  class?: string
}

export function PlaceholderView(props: ParentProps<IPlaceholderViewProps>) {
  return (
    <div class={`${placeholderView} ${props.class ?? ""}`}>
      {props.icons$}
      <p class={placeholderView__text}>
        {props.children}
      </p>
    </div>
  )
}