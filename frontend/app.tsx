import type { ParentProps } from 'solid-js'
import { useLocation } from '@solidjs/router'

export default function App(props: ParentProps) {
  const location = useLocation()

  return (
    <>
      {props.children}
    </>
  )
}
