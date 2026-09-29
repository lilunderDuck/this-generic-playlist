import { type ParentProps } from "solid-js"
import { TbZoomCancel, TbZoomIn, TbZoomOut } from 'solid-icons/tb'
// ...
import { css } from "molcss"
// ...
import { Button, ButtonSize, ButtonVariant, Tooltip } from "../ui"
import { useZoomAndPanContext } from "./ZoomAndPanProvider"

const buttonRow__root = css`
  gap: 10px;
  user-select: none;
  padding-inline: 10px;
  padding-block: 5px;
  display: flex;
  align-items: center;
`

const buttonRow__scaleText = css`
  min-width: 3rem;
  background-color: var(--base);
  padding-inline: 5px;
  padding-block: 4px;
  border-radius: 6px;
  text-align: center;
`

export function ZoomButtonRow(props: ParentProps) {
  const { unzoom$, zoom$, reset$, zoomScale$ } = useZoomAndPanContext()

  return (
    <div class={buttonRow__root}>
      <Tooltip label$="Reset to default zoom">
        <Button 
          size$={ButtonSize.ICON_LARGE} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={reset$} 
          disabled={zoomScale$() === 1}
        >
          <TbZoomCancel size={25} />
        </Button>
      </Tooltip>
      <Tooltip label$="Zoom out">
        <Button 
          size$={ButtonSize.ICON_LARGE} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={unzoom$} 
          disabled={zoomScale$() === 0}
        >
          <TbZoomOut size={25} />
        </Button>
      </Tooltip>
      <Tooltip label$="Zoom in">
        <Button 
          size$={ButtonSize.ICON_LARGE} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={zoom$}
        >
          <TbZoomIn size={25} />
        </Button>
      </Tooltip>
      <span class={buttonRow__scaleText}>
        {zoomScale$()}x
      </span>
      {props.children}
    </div>
  )
}