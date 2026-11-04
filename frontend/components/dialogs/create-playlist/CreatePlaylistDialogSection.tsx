import { css } from "molcss";
import type { ParentProps } from "solid-js";

const section__root = css`
  margin-bottom: 25px;
`

const section__nameWrap = css`
  background-color: var(--mauve);
  color: var(--crust);
  padding-block: 3px;
  width: 100%;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
`

export default function CreatePlaylistDialogSection(props: ParentProps<{ name$: string, class?: string }>) {
  return (
    <section class={`${section__root} ${props.class ?? ""}`}>
      <div class={section__nameWrap}>
        {props.name$}
      </div>
      {props.children}
    </section>
  )
}