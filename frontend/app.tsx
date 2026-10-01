import type { ParentProps } from 'solid-js'
import { PlaylistProvider } from './provider'

export default function App(props: ParentProps) {
  return (
    <PlaylistProvider>
      {props.children}
    </PlaylistProvider>
  )
}
