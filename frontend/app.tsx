import type { ParentProps } from 'solid-js'
import { PlaylistProvider } from './provider'
import { duckDotLogWithLabel, startHeartbeat } from './utils'

export default function App(props: ParentProps) {
  if (!import.meta.env.DEV) {
    startHeartbeat(() => {}, () => {})
  } else {
    duckDotLogWithLabel('debug', "heartbeat is disabled on dev mode")
  }

  window.addEventListener('focus', () => {
    document.body.classList.remove("freeze_animations")
  })
  
  window.addEventListener('blur', () => {
    document.body.classList.add("freeze_animations")
  })

  return (
    <PlaylistProvider>
      {props.children}
    </PlaylistProvider>
  )
}
