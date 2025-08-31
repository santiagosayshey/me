import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import './stores/theme' // Initialize theme store and keyboard shortcuts

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
