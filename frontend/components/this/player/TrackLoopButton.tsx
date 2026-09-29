import { css } from "molcss";
import { TbRepeat, TbRepeatOff, TbRepeatOnce } from "solid-icons/tb";
import { Match, Switch } from "solid-js";
import { usePlaylistContext } from "../../../provider";
import { LoopingState } from "../../../provider/trackState";
import { Tooltip } from "../../ui";

const playlistControl__button = css`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--overlay2);
  &:disabled {
    opacity: 0.7;
  }
  &:hover {
    color: var(--text);
  }
`

const playlistControl__smallButton = css`
  width: 2.75rem;
  height: 2.75rem;
`

export function TrackLoopButton() {
  const { playlistState$ } = usePlaylistContext()

  let currentLoopingState = playlistState$.loopingState$()
  const cycleThrough = () => {
    currentLoopingState += 1
    playlistState$.setLoopingState$(currentLoopingState % 3)
  }

  const getTooltipText = () => {
    switch (playlistState$.loopingState$()) {
      case LoopingState.REPEAT_ONCE:
        return "Repeat currently played track"
      case LoopingState.REPEAT_PLAYLIST:
        return "Repeat currently played playlist"
      case LoopingState.NO_REPEAT:
        return "No looping"
    }
  }

  return (
    <Tooltip label$={getTooltipText()}>
      <button 
        class={`${playlistControl__smallButton} ${playlistControl__button}`}
        onClick={cycleThrough}
        disabled={playlistState$.currentTrack$() == null}
      >
        <Switch>
          <Match when={playlistState$.loopingState$() === LoopingState.NO_REPEAT}>
            <TbRepeatOff size={25} />
          </Match>

          <Match when={playlistState$.loopingState$() === LoopingState.REPEAT_ONCE}>
            <TbRepeatOnce size={25} />
          </Match>

          <Match when={playlistState$.loopingState$() === LoopingState.REPEAT_PLAYLIST}>
            <TbRepeat size={25} />
          </Match>
        </Switch>
      </button>
    </Tooltip>
  )
}