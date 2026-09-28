import { css } from "molcss";
import { HTMLAttributes } from "~/utils";

const buttonRow__button = css`
  width: 35px;
  height: 35px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--subtext0);
  &:disabled {
    opacity: 0.65;
  }

  &:not(:disabled):hover {
    background-color: var(--surface0);
  }
`

export function LargeIconButton(props: HTMLAttributes<"button">) {
  return <button {...props} class={`${buttonRow__button} ${props.class ?? ""}`}></button>
}