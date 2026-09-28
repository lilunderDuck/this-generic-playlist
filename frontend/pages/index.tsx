import { css } from 'molcss'
import { root } from '..'
import { onCleanup } from 'solid-js'
import { Button, ButtonSize, ButtonVariant, PlaylistItem, PlaylistSearchBar, PlaylistSidebarItemInfo, Tooltip } from '../components'
import { BsPlus } from 'solid-icons/bs'

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
      {/* <PlaylistSidebarItemInfo 
        id='untitled_goose_game_ost_395813'
        name='Untitled Goose Game OST'
        author={{
          name: "Claude Debussy, Dan Golding",
        }}
        coverIconImage='cover.jpg'
        bannerImage='banner.jpg'
        description="The soundtrack in the game: Untitled Goose Game - a slapstick-stealth-sandbox, where you are a goose let loose on an unsuspecting village. Make your way around town, from peoples' back gardens to the high street shops to the village green, setting up pranks, stealing hats, honking a lot, and generally ruining everyone's day."
      /> */}
      <PlaylistSidebarItemInfo 
        id='mihoshiho_it_will_be_okay_495491'
        name='Mihoshiho: It Will Be Okay! OST'
        author={{
          name: "redtomatochicken",
          url: "https://www.youtube.com/@redtomato8188"
        }}
        coverIconImage='cover.png'
        bannerImages={['banner.jpg', 'banner_2.jpg', 'banner_3.jpg']}
        description="A soundtrack for an adventure RPG game where absolutely nothing bad happens!"
        createdAt={Date.now()}
        totalRuntimeInSecond={1305}
        totalTrack={13}
      />
    </>
  )
}
