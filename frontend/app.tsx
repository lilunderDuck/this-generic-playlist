import type { ParentProps } from 'solid-js'
import { useLocation } from '@solidjs/router'
import { PlaylistProvider } from './provider'

export default function App(props: ParentProps) {
  const location = useLocation()

  return (
    <PlaylistProvider>
      {props.children}
    </PlaylistProvider>
  )
}
