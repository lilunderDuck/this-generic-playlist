import { css } from 'molcss'
import { BsPlus } from 'solid-icons/bs'
import { onCleanup, Show } from 'solid-js'
// ...
import { root } from '..'
import { Button, ButtonSize, ButtonVariant, PlaylistItem, PlaylistSearchBar, PlaylistSidebarItemInfo, Tooltip } from '../components'
import { usePlaylistContext } from '../provider'

const home__root = css`
  width: 100%;
  height: 100%;
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
`

export default function Home() {
  const { sidebarInfo$ } = usePlaylistContext()

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
          <PlaylistItem 
            id='mihoshiho_it_will_be_okay_495491'
            name='Mihoshiho: It Will Be Okay! OST'
            author={{
              name: "redtomatochicken",
              url: "https://www.youtube.com/@redtomato8188"
            }}
            coverIconImage='cover.png'
          />
          <PlaylistItem 
            id='untitled_goose_game_ost_395813'
            name='Untitled Goose Game OST'
            author={{
              name: "Claude Debussy, Dan Golding",
            }}
            coverIconImage='cover.jpg'
          />
        </div>
      </main>
      <Show when={sidebarInfo$()}>
        <PlaylistSidebarItemInfo info$={sidebarInfo$()!} />
      </Show>
    </>
  )
}
