import { css } from 'molcss'
import { createSignal } from 'solid-js'

const home__root = css`
  width: 100%;
  height: 100%;
`

export default function Home() {
  const [count, setCount] = createSignal(0)

  return (
    <main class={home__root}>
      {/* ... */}
    </main>
  )
}
