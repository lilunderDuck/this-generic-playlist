import type { ParentProps } from 'solid-js'
import { PlaylistProvider } from './provider'
import { duckDotLogWithLabel, startHeartbeat } from './utils'

export default function App(props: ParentProps) {
  if (!import.meta.env.DEV) {
    startHeartbeat(() => {}, () => {})
  } else {
    duckDotLogWithLabel('debug', "heartbeat is disabled on dev mode")
  }

  return (
    <PlaylistProvider>
      {props.children}
    </PlaylistProvider>
  )
}
