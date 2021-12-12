if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
}

if (
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone
) {
  console.log('display-mode is standalone')
}

class App {
  store
  noteElement

  initialiseStorage() {
    this.store = new Store('appStorageKey')
  }

  initialiseValues() {
    this.noteElement.value = this.store.data
  }

  handleChange(e) {
    const state = e.currentTarget.value
    this.store.data = state
  }

  registerEventListeners() {
    this.noteElement.addEventListener('keydown', e => this.handleChange(e))
  }

  constructor(noteElement = null) {
    if (!noteElement) {
      throw new Error('Note element not found')
    }

    this.noteElement = noteElement

    this.initialiseStorage()
    this.registerEventListeners()
    this.initialiseValues()
  }
}

const app = new App(document.querySelector('#note'))
const status = document.querySelector('#status')

window.addEventListener('online', () => (status.innerText = 'online'))
window.addEventListener('offline', () => (status.innerText = 'offline'))
