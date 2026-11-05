import { createSignal } from "solid-js"
import { css } from "molcss"
// ...
import type { EventHandler } from "../../../utils"
import { Input } from "../../ui"

const input__errorInputHighlight = css`
  outline: 4px solid var(--maroon);
`

type ErrorMessageOrNone = string | null

interface IInputStateOptions<T extends any> {
  placeholder$: string
  initialValue$: T
  onValidate$(currentValue: T): ErrorMessageOrNone
  onError$(errorMessage: string | null): any
  onErrorReset$(): any
}

export function createInputState<T extends any>(options: IInputStateOptions<T>) {
  const [currentValue, setCurrentValue] = createSignal<T>(options.initialValue$)
  const [shouldHighlightInput, setShouldHighlightInput] = createSignal(false)

  const onInputStuff: EventHandler<"input", "onInput"> = (inputEvent) => {
    reset()
    setCurrentValue(inputEvent.currentTarget.value)
  }

  const reset = () => {
    if (shouldHighlightInput()) {
      setShouldHighlightInput(false)
      options.onErrorReset$()
    }
  }

  const clear = () => {
    setCurrentValue('')
  }

  return {
    Input$: () => (
      <Input 
        autocomplete="off" 
        placeholder={options.placeholder$} 
        class={shouldHighlightInput() ? input__errorInputHighlight : ""}
        onInput={onInputStuff}
        value={currentValue()}
      />
    ),
    highlightInput$(state: boolean) {
      setShouldHighlightInput(state)
    },
    clear$: clear,
    currentValue$: currentValue,
    tryValidate$() {
      const validateResult = options.onValidate$(currentValue())
      if (!validateResult) {
        return true
      }

      setShouldHighlightInput(true)
      options.onError$(validateResult)
      return false
    }
  }
}