import { css } from 'molcss'
import { BsPlus } from 'solid-icons/bs'
import { For, onCleanup, Show } from 'solid-js'
// ...
import { root } from '..'
import { Button, ButtonSize, ButtonVariant, PlaylistItem, PlaylistSearchBar, PlaylistSidebarItemInfo, Tooltip, TrackPlayer } from '../components'
import { usePlaylistContext } from '../provider'

const home__root = css`
  width: 100%;
  height: 100%;
  position: relative;
`

const home__header = css`
  padding-inline: 20px;
  padding-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
`

const home__rootElement = css`
  display: flex;
  align-items: center;
`

const home__content = css`
  background-color: var(--mantle);
  padding-inline: 10px;
  padding-block: 5px;
  height: calc(100% - 65px - 10px);
  margin: 10px;
  display: flex;
  gap: 10px;
  border-radius: 6px;
`

export default function Home() {
  const { sidebarInfo$, playlistItems$, playlistState$ } = usePlaylistContext()

  root.className = home__rootElement
  onCleanup(() => root.className = "")

  return (
    <>
      <main class={home__root}>
        <header class={home__header}>
          <Tooltip label$="Create a playlist">
            <Button variant$={ButtonVariant.NO_BACKGROUND} size$={ButtonSize.ICON_LARGE}>
              <BsPlus size={30} />
            </Button> 
          </Tooltip>
          <PlaylistSearchBar />
          <div />
        </header>
        <div class={home__content}>
          <For each={playlistItems$()}>
            {it => (
              <PlaylistItem {...it} />
            )}
          </For>
        </div>

        <Show when={playlistState$.currentTrack$()}>
          <TrackPlayer class={css`position: absolute; width: calc(100% - 20px); left: 10px; bottom: 10px; border-radius: 6px;`} />
        </Show>
      </main>
      <Show when={sidebarInfo$()}>
        <PlaylistSidebarItemInfo info$={sidebarInfo$()!} />
      </Show>
    </>
  )
}
