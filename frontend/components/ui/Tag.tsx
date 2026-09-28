import { css } from "molcss"
import { For, ParentProps, Show } from "solid-js"
import { Tooltip } from "./Tooltip"

const tag__root = css`
  padding-inline: 8px;
  padding-block: 2px;
  font-size: 14px;
  background-color: var(--tag-color);
  color: var(--tag-text-color);
  border-radius: 6px;
`

const tagList__root = css`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`

const tagList__moreTagsIndicator = css`
  padding-inline: 8px;
  padding-block: 2px;
  font-size: 14px;
  background-color: var(--surface1);
  border-radius: 6px;
`

interface ITagProps {
  color$: string
}

export function Tag(props: ParentProps<ITagProps>) {
  return (
    <div 
      class={tag__root} 
      style={`--tag-color:${props.color$};--tag-text-color:${isWarmColor(props.color$) ? "var(--crust)" : "var(--text)"}`}
    >
      {props.children}
    </div>
  )
}

interface ITagListProps {
  tags$: {color: string, name: string}[]
  limit$?: number
}

export function TagList(props: ITagListProps) {
  const displayedTags = () => {
    if (!props.limit$) return props.tags$
    if (props.limit$ === props.tags$.length) return props.tags$

    const newTags: ITagListProps["tags$"] = []
    for (let i = 0; i < props.limit$; i++) {
      newTags[i] = props.tags$[i]
    }

    return newTags
  }

  const getRemainingTags = () => props.tags$.length - props.limit$!
  const shouldShowMoreTagsIndicator = () => props.limit$ !== undefined && getRemainingTags() >= 1

  return (
    <div class={tagList__root}>
      <For each={displayedTags()}>
        {it => (
          <Tag color$={it.color}>
            {it.name}
          </Tag>
        )}
      </For>

      <Show when={shouldShowMoreTagsIndicator()}>
        <Tooltip label$={
          <div class={css`display: flex; gap: 10px; flex-wrap: wrap;`}>
            <For each={props.tags$}>
              {it => (
                <Tag color$={it.color}>
                  {it.name}
                </Tag>
              )}
            </For>
          </div>
        }>
          <div class={tagList__moreTagsIndicator}>
            +{getRemainingTags()}
          </div>
        </Tooltip>
      </Show>
    </div>
  )
}

function isWarmColor(hex: string) {
  // 1. Clean the hex string and parse RGB values
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  // 2. Find min and max values to calculate Hue
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max === min) {
    h = 0; // Achromatic/neutral (gray, white, black)
  } else {
    const d = max - min;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Convert hue fractional value to degrees (0 - 360)
  const hueDegrees = h * 360;

  // 3. Evaluate temperature based on the color wheel boundaries
  // Warm colors: 0° to 180° (Red to Yellow-Green)
  // Cool colors: 180° to 360° (Green to Violet-Red)
  return hueDegrees >= 0 && hueDegrees < 180
}