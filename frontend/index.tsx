/* @refresh reload */
import './assets/index.css'
import 'molcss/style.css'
// @ts-ignore
import routes from '~solid-pages'
import { render } from 'solid-js/web'
import App from './app'
import { Router } from '@solidjs/router'
import { duckDotLog } from './utils'
import "./monke_patch"

declare global {
  const APP_NAME: string
  const APP_USED_STACK: string
}

duckDotLog(
  `${APP_NAME}, made with ${APP_USED_STACK}, love is the 1st ingredient in this case!\n`,
  `Version:     1.0.0-4112c7b \n`,
)

duckDotLog("wth-app-stack\n",
  `solid-js   -> library used to make the thing you see right here \n`,
  `golang     -> also the thing that dealing with loading/saving playlist data \n`,
  `catpucchin -> theme used in this app \n`,
  `catcom     -> allows communication between frontend (the one you see here) and backend (the thing that messing with playlist data) \n`,
  "\n"
)

export const root = document.getElementById('root')!

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

console.log(routes)

render(
  () => <Router root={App}>{routes}</Router>,
  root,
)
