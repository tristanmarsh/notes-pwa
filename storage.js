class Store {
  localStorageKey = null
  
  constructor(localStorageKey = 'noteApp') {
    this.localStorageKey = localStorageKey
  }

  get data() {
    return window.localStorage.getItem(this.localStorageKey)
  }

  set data(state) {
    window.localStorage.setItem(this.localStorageKey, state)
  }
}
