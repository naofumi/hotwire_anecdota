import { Controller } from "@hotwired/stimulus"
import { slideDrawerStore } from "../stores/slide_drawer_store"

// Connects to data-controller="slide-drawer"
export default class extends Controller {
  static values = {
    shown: {type: Boolean, default: false},
    selectedTab: {type: Number, default: 0},
  }
  static targets = ["drawer"]

  connect() {
    this.storeKey = "hotel-slide-drawer"
    this.#setState()
    this.#render()

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

  show(event) {
    slideDrawerStore.getState().open(this.storeKey)
  }

  hide() {
    slideDrawerStore.getState().close(this.storeKey)
  }

  #setState() {
    if (this.shownValue === true) {
      slideDrawerStore.getState().open(this.storeKey)
    } else {
      slideDrawerStore.getState().close(this.storeKey)
    }
  }

  #render() {
    if (slideDrawerStore.getState().opened(this.storeKey)) {
      document.body.style.overflow = "hidden"
      this.drawerTarget.ariaHidden = false
    } else {
      document.body.style.overflow = "auto"
      this.drawerTarget.ariaHidden = true
    }
  }
}
