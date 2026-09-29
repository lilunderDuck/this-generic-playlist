import { css } from "molcss"
import { createAsync, useParams } from "@solidjs/router"
import { createEffect, For, Show } from "solid-js"
// ...
import { CODEC, playlistBannerUrl, playlistCoverIconUrl } from "../../api"
import { LoopingState, usePlaylistContext } from "../../provider"
import { Author, TrackHeader, TrackItem, TrackPlayer } from "../../components"
import { formatSecondsToMMSS, scrollbar, scrollbar__invs, scrollbar__vertical } from "../../utils"

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
`

const playlist__headerShadow = css`
  width: 100%;
  height: 15rem;
  background: linear-gradient(to top, var(--crust) 0%, transparent 100%);
  position: absolute;
  bottom: 0;
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
  const { playlistItems$, playlistState$ } = usePlaylistContext()

  const tracksData = playlistTracksData()
  const currentPlaylist = () => playlistItems$().find(it => it.id === param.playlistId!)!

  createEffect(() => {
    const tracks = tracksData()
    if (!tracks) return
    playlistState$.syncData$(currentPlaylist(), tracks)
  })

  return (
    <Show when={tracksData()}>
      <main class={`${playlist__root} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
        <header class={playlist__header} style={`--playlist-banner-url:url('${playlistBannerUrl(currentPlaylist().id, currentPlaylist().bannerImages?.[0]!)}')`}>
          <div class={playlist__info}>
            <div 
              class={`${playlist__coverIcon} ${currentPlaylist().coverIconImage ? playlist__coverIconHasIcon : playlist__coverIconEmpty}`}
              style={`--playlist-cover-icon-url:url('${playlistCoverIconUrl(param.playlistId!, currentPlaylist().coverIconImage ?? '')}')`}
            />
            <div>
              <h1>{currentPlaylist().name}</h1>
              <Author info$={currentPlaylist().author} />
              <div class={playlist__runtimeStat}>
                {currentPlaylist().totalTrack} total tracks • {formatSecondsToMMSS(currentPlaylist().totalRuntimeInSecond)} in total time
              </div>
            </div>
          </div>
          <div class={playlist__headerShadow}></div>
        </header>
        <TrackHeader />
        <section class={css`padding-bottom: 10rem;`} data-is-repeat-once={playlistState$.loopingState$() === LoopingState.REPEAT_ONCE}>
          <For each={tracksData()!}>
            {(it, index) => (
              <TrackItem {...it} index$={index() + 1} playlistId$={param.playlistId!} />
            )}
          </For>
        </section>
      </main>
      <TrackPlayer />
    </Show>
  )
}