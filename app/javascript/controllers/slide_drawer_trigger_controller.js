import { Controller } from "@hotwired/stimulus"
import { slideDrawerStore } from "../stores/slide_drawer_store"

// Connects to data-controller="slide-drawer-trigger"
export default class extends Controller {
  connect() {
    this.storeKey = "hotel-slide-drawer"
    this.unsubscribe = slideDrawerStore.subscribe(
      (s) => ({ drawerState: s.drawers[this.storeKey] }),
      (state) => {
        this.#render()
      }
    )
  }

  disconnect() {
    this.unsubscribe && this.unsubscribe()
  }

  show() {
    slideDrawerStore.getState().open(this.storeKey)
  }

  #render() {
    const isOpened = slideDrawerStore.getState().opened(this.storeKey)
    const allTabs = Array.from(this.element.parentElement.children)
    const openedTab = isOpened ? this.element : allTabs[0]

    allTabs.forEach(e => {
      e.ariaSelected = (e === openedTab) ? 'true' : 'false'
    })
  }
}
