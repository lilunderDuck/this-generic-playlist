import { css } from "molcss"
import { playlistBannerUrl, playlistCoverIconUrl, type IPlaylistItemData } from "../../api"
import { BiSolidPlaylist, BiSolidTime } from "solid-icons/bi"
import { For, Show } from "solid-js"
import { Button, ButtonSize, ButtonVariant, Dialog, MarkdownText, Tooltip } from "../ui"
import { formatSecondsToMMSS } from "../../utils"
import { Author } from "./Author"
import { usePlaylistContext } from "../../provider"
import { BsArrowCounterclockwise, BsCircleFill, BsImageFill } from "solid-icons/bs"
import { A } from "@solidjs/router"
import PlaylistBannerDialogContent from "./PlaylistBannerDialogContent"

const sidebar__root = css`
  width: 55%;
  height: calc(100% - 2 * 10px);
  background-color: var(--mantle);
  border-radius: 6px;
  margin: 10px;
  user-select: none;
  position: relative;
`

const sidebar__bannerSection = css`
  width: 100%;
  height: 13.5rem;
  position: relative;
  & #item__hideButton {
    opacity: 0;
  }

  &:hover #item__hideButton {
    opacity: 1;
  }
`

const sidebar__banner = css`
  width: 100%;
  height: 13.5rem;
  border-radius: 6px;
  filter: blur(1px) brightness(0.5);
`

const sidebar__bannerExistBanner = css`
  background: center center no-repeat var(--playlist-banner-url);
  background-size: cover;
`

const sidebar__coverIconWrap = css`
  position: absolute;
  bottom: 0;
  display: flex;
  gap: 10px;
  padding-inline: 10px;
  padding-bottom: 10px;
`

const sidebar__coverIcon = css`
  width: 8rem;
  height: 8rem;
  border-radius: 6px;
  flex-shrink: 0;
`

const sidebar__coverIconHasIcon = css`
  background: center center no-repeat var(--playlist-cover-icon-url);
  background-size: cover;
`

const sidebar__coverIconEmpty = css`
  background-color: var(--base);
`

const sidebar__metadataInfoSection = css`
  margin-block: 5px;
`

const sidebar__metadataInfoLine = css`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-inline: 10px;
  padding-block: 4px;
`

const sidebar__descriptionSection = css`
  padding: 10px;
`

const sidebar__playlistName = css`
  line-height: 1;
  margin-bottom: 10px;
`

const sidebar__bottomBarSection = css`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding-bottom: 10px;
  padding-right: 10px;
`

const sidebar__moreOptionsButtonRow = css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  margin: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`

export function PlaylistSidebarItemInfo(props: { info$: IPlaylistItemData }) {
  const { setSidebarInfo$, resyncPlaylist$ } = usePlaylistContext()

  const getStats = () => [
    { icon$: BiSolidPlaylist, stat$: `Contain ${props.info$.totalTrack} tracks` },
    { icon$: BiSolidTime, stat$: `Total playlist runtime is ${formatSecondsToMMSS(props.info$.totalRuntimeInSecond)}` },
    // { icon$: BsCalendar, stat$: "Playlist created at 10:40 AM, 10/04/2024" },
  ]

  const pickRandomBanner = () => {
    if (!props.info$.bannerImages) return ''
    const index = Math.floor(Math.random() * props.info$.bannerImages.length)
    return props.info$.bannerImages[index]
  }

  const closeSidebar = () => {
    setSidebarInfo$(null)
  }

  return (
    <aside 
      class={sidebar__root} 
      style={`--playlist-cover-icon-url:url('${playlistCoverIconUrl(props.info$.id, props.info$.coverIconImage ?? '')}');--playlist-banner-url:url('${playlistBannerUrl(props.info$.id, pickRandomBanner())}')`}
    >
      <section class={sidebar__bannerSection}>
        <div class={sidebar__moreOptionsButtonRow}>
          <Show when={(props.info$.bannerImages?.length ?? 0) != 0}>
            <Tooltip label$="See all banner images of this playlist">
              <Dialog dialogContent$={(contentProps) => <PlaylistBannerDialogContent 
                {...contentProps}
                banners$={props.info$.bannerImages!}
                playlistId$={props.info$.id}
              />}>
                <Button size$={ButtonSize.ICON} id="item__openDirectlyBtn">
                  <BsImageFill />
                </Button>
              </Dialog>
            </Tooltip>
          </Show>

          <Tooltip label$="Resync playlist">
            <Button size$={ButtonSize.ICON} id="item__hideButton" onClick={() => resyncPlaylist$(props.info$.id)}>
              <BsArrowCounterclockwise />
            </Button>
          </Tooltip>
        </div>
        <div class={`${sidebar__banner} ${sidebar__bannerExistBanner}`} />
        <div class={sidebar__coverIconWrap}>
          <div class={`${sidebar__coverIcon} ${props.info$.coverIconImage ? sidebar__coverIconHasIcon : sidebar__coverIconEmpty}`} />
          <div>
            <h1 class={sidebar__playlistName}>{props.info$.name}</h1>
            <Author info$={props.info$.author} />
          </div>
        </div>
      </section>
      <section class={sidebar__metadataInfoSection}>
        <For each={getStats()}>
          {it => (
            <div class={sidebar__metadataInfoLine}>
              <it.icon$ size={25} />
              {it.stat$}
            </div>
          )}
        </For>
      </section>
      <section class={sidebar__descriptionSection}>
        <MarkdownText>
          {props.info$.description}
        </MarkdownText>
      </section>
      <section class={sidebar__bottomBarSection}>
        <Button variant$={ButtonVariant.DANGER} onClick={closeSidebar}>
          Close
        </Button>
        <a href={`/playlist/${props.info$.id}`}>
          <Button variant$={ButtonVariant.SECONDARY}>
            Play this one for me
          </Button>
        </a>
      </section>
    </aside>
  )
}