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
  const { trackState$ } = usePlaylistContext()

  let currentLoopingState = trackState$.loopingState$()
  const cycleThrough = () => {
    currentLoopingState += 1
    trackState$.setLoopingState$(currentLoopingState % 3)
  }

  const getTooltipText = () => {
    switch (trackState$.loopingState$()) {
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
        disabled={trackState$.currentTrack$() == null}
      >
        <Switch>
          <Match when={trackState$.loopingState$() === LoopingState.NO_REPEAT}>
            <TbRepeatOff size={25} />
          </Match>

          <Match when={trackState$.loopingState$() === LoopingState.REPEAT_ONCE}>
            <TbRepeatOnce size={25} />
          </Match>

          <Match when={trackState$.loopingState$() === LoopingState.REPEAT_PLAYLIST}>
            <TbRepeat size={25} />
          </Match>
        </Switch>
      </button>
    </Tooltip>
  )
}