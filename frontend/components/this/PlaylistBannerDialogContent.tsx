import { createSignal, Show } from "solid-js"
import { BsCaretLeftFill, BsCaretRightFill, BsX } from "solid-icons/bs"
import { css } from "molcss"
import { playlistBannerUrl, type IPlaylistItemData } from "../../api"
import { ZoomAndPanProvider, ZoomButtonRow, ZoomDisplay } from "../pan-and-zoom"
import { Button, ButtonSize, ButtonVariant, Spacer, Tooltip, type IDialogContentProps } from "../ui"

interface IPlaylistBannerDialogContentProps extends IDialogContentProps {
  playlistId$: IPlaylistItemData["id"]
  banners$: NonNullable<IPlaylistItemData["bannerImages"]>
}

const dialog__root = css`
  width: 100%;
  height: 100%;
`

const dialog__header = css`
  position: absolute;
  padding: 10px;
  z-index: 5;
  width: 100%;
  gap: 10px;
  display: flex;
  align-items: center;
`

export default function PlaylistBannerDialogContent(props: IPlaylistBannerDialogContentProps) {
  const [currentBannerIndex, setCurrentBannerIndex] = createSignal(0)

  return (
    <ZoomAndPanProvider>
      <div class={dialog__root}>
        <header class={dialog__header}>
          <ZoomButtonRow />
          <Spacer />
          <Show when={props.banners$.length > 1}>
            <Tooltip label$="Go to previous banner">
              <Button 
                variant$={ButtonVariant.NO_BACKGROUND} 
                size$={ButtonSize.ICON_LARGE}
                disabled={currentBannerIndex() == 0}
                onClick={() => setCurrentBannerIndex(prev => prev - 1)}
              >
                <BsCaretLeftFill size={25} />
              </Button>
            </Tooltip>
            <Tooltip label$="Go to next banner">
              <Button 
                variant$={ButtonVariant.NO_BACKGROUND} 
                size$={ButtonSize.ICON_LARGE}
                disabled={currentBannerIndex() == props.banners$.length - 1}
                onClick={() => setCurrentBannerIndex(prev => prev + 1)}
              >
                <BsCaretRightFill size={25} />
              </Button>
            </Tooltip>
          </Show>
          <div class={css`width: 0.5rem;`} />
          <Tooltip label$="Close">
            <Button 
              variant$={ButtonVariant.NO_BACKGROUND} 
              size$={ButtonSize.ICON_LARGE}
              onClick={props.close$}
            >
              <BsX size={25} />
            </Button>
          </Tooltip>
        </header>
        <ZoomDisplay>
          <img draggable={false} src={playlistBannerUrl(props.playlistId$, props.banners$[currentBannerIndex()])} />
        </ZoomDisplay>
      </div>
    </ZoomAndPanProvider>
  )
}