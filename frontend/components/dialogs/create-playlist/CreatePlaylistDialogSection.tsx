import { css } from "molcss";
import type { ParentProps } from "solid-js";

const section__nameWrap = css`
  background-color: var(--surface0);
  padding-block: 8px;
  width: 100%;
  border-radius: 6px;
  text-align: center;
`

export default function CreatePlaylistDialogSection(props: ParentProps<{ name$: string, class?: string }>) {
  return (
    <section class={props.class}>
      <div class={section__nameWrap}>
        {props.name$}
      </div>
      {props.children}
    </section>
  )
}