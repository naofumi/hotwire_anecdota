import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="chapter-list"
export default class extends Controller {
  static values = {shown: {type: Boolean}}
  connect() {
    document.addEventListener("click", this.#clickOutsideHandler.bind(this))
  }

  disconnect() {
    document.removeEventListener("click", this.#clickOutsideHandler)
  }

  toggle() {
    console.log('toggle')
    this.shownValue = !this.shownValue
  }

  show() {
    console.log('show')
    this.shownValue = true
  }

  hide() {
    console.log('hide')
    this.shownValue = false
  }

  #clickOutsideHandler(event) {
    if (!this.element.contains(event.target)) {
      console.log('click outside')
      this.hide()
    }
  }
}
