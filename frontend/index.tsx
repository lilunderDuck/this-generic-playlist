/* @refresh reload */
import './assets/index.css'
import { render } from 'solid-js/web'
import App from './app'
import { Router } from '@solidjs/router'
// @ts-ignore
import routes from '~solid-pages'

const root = document.getElementById('root')!

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(
  () => <Router root={(props) => <App>{props.children}</App>}>{routes}</Router>,
  root,
)
