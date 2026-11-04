import { css } from "molcss"
import { A, createAsync, useParams } from "@solidjs/router"
import { For, Show } from "solid-js"
import { BsArrowLeft } from "solid-icons/bs"
// ...
import { CODEC, playlistBannerUrl, playlistCoverIconUrl, type ITrackData } from "../../api"
import { LoopingState, usePlaylistContext } from "../../provider"
import { Author, Button, ButtonSize, Tooltip, TrackHeader, TrackItem, TrackPlayer } from "../../components"
import { duckDotLogWithLabel, formatSecondsToMMSS, scrollbar, scrollbar__invs, scrollbar__vertical } from "../../utils"

const playlist__root = css`
  width: 100%;
  height: 100%;
`

const playlist__header = css`
  width: 100%;
  height: 15rem;
  background: center center no-repeat var(--playlist-banner-url);
  background-size: cover;
  position: relative;
  user-select: none;
  & #playlist__goBackBtn {
    opacity: 0.35;
  }

  & #playlist__goBackBtn:hover {
    opacity: 1;
  }
`

const playlist__headerShadow = css`
  width: 100%;
  height: 15rem;
  background: linear-gradient(to top, var(--crust) 0%, transparent 100%);
  position: absolute;
  bottom: 0;
  padding-inline: 20px;
  padding-top: 5px;
`

const playlist__info = css`
  position: absolute;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 2rem;
  width: calc(100% - 2 * 20px);
  margin-bottom: 15px;
  margin-inline: 20px;
`

const playlist__coverIcon = css`
  width: 11.5rem;
  height: 11.5rem;
  border-radius: 6px;
  position: relative;
`

const playlist__coverIconHasIcon = css`
  background: center center no-repeat var(--playlist-cover-icon-url);
  background-size: cover;
`

const playlist__coverIconEmpty = css`
  background-color: var(--base);
`

const playlist__runtimeStat = css`
  margin-top: 15px;
  font-size: 14px;
`

const playlist__goBackBtnWrapper = css`
  position: fixed;
  top: 10px;
  left: 20px;
  z-index: 10;
  & button {
    gap: 10px;
    opacity: 0.7;
  }

  & button:hover {
    opacity: 1;
  }
`

const playlist__name = css`
  font-size: 3rem;
`


function playlistTracksData() {
  const param = useParams()

  console.assert(param.playlistId !== undefined, "playlistId is undefined!!!")

  return createAsync(async() => {
    const tracks = await CODEC.track_getAll$({ playlistId: param.playlistId! })
    return tracks
  })
}

export default function PlaylistTracksPage() {
  const param = useParams()
  const { playlistItems$, playlistState$, trackPlayer$ } = usePlaylistContext()

  const tracksData = playlistTracksData()
  const currentPlaylist = () => playlistItems$().find(it => it.id === param.playlistId!)!

  duckDotLogWithLabel("state transition", "LAZY_RESYNC_PLAYLIST_DATA for: ", currentPlaylist()?.name)

  const whenClickingTrackItem = (someTrack: ITrackData, trackIndex: number) => {
    // only update the playlist and tracks data when playing some track
    if (playlistState$.currentPlaylist$()?.id !== currentPlaylist().id) {
      playlistState$.syncData$(currentPlaylist(), tracksData()!)
    }

    playlistState$.playTrack$(someTrack, trackIndex)
  }

  const bannerImageUrl = () => playlistBannerUrl(currentPlaylist().id, currentPlaylist().bannerImages?.[0]!)

  return (
    <Show when={tracksData()}>
      <div class={playlist__goBackBtnWrapper} id="playlist__goBackBtn">
        <Tooltip label$="Go back to home">
          <A href="/">
            <Button size$={ButtonSize.LARGE}>
              <BsArrowLeft size={20} />
              Go back
            </Button>
          </A>
        </Tooltip>
      </div>
      <main class={`${playlist__root} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
        <header 
          class={playlist__header} 
          style={`--playlist-banner-url:url('${bannerImageUrl()}')`}
        >
          <div class={playlist__info}>
            <div 
              class={`${playlist__coverIcon} ${currentPlaylist().coverIconImage ? playlist__coverIconHasIcon : playlist__coverIconEmpty}`}
              style={`--playlist-cover-icon-url:url('${playlistCoverIconUrl(param.playlistId!, currentPlaylist().coverIconImage ?? '')}')`}
            />
            <div>
              <h1 class={playlist__name}>
                {currentPlaylist().name}
              </h1>
              <Author info$={currentPlaylist().author} />
              <div class={playlist__runtimeStat}>
                {currentPlaylist().totalTrack} total tracks • {formatSecondsToMMSS(currentPlaylist().totalRuntimeInSecond)} in total time
              </div>
            </div>
          </div>
          <div class={playlist__headerShadow} />
        </header>
        <TrackHeader />
        <section 
          class={`${css`padding-bottom: 10rem;`} trackItemList`} 
          data-is-repeat-once={playlistState$.loopingState$() === LoopingState.REPEAT_ONCE}
        >
          <For each={tracksData()!}>
            {(it, index) => (
              <TrackItem 
                {...it} 
                index$={index() + 1} playlistId$={param.playlistId!}
                onClickingThisItem$={() => whenClickingTrackItem(it, index())}
              />
            )}
          </For>
        </section>
      </main>
      <TrackPlayer class={css`position: fixed; bottom: 0;`} />
    </Show>
  )
}