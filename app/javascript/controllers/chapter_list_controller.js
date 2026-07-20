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
    this.shownValue = !this.shownValue
  }

  show() {
    this.shownValue = true
  }

  hide() {
    this.shownValue = false
  }

  scroll(event) {
    event.preventDefault()
    const elementId = event.currentTarget.getAttribute('href').replace('#', '')
    const element = document.getElementById(elementId)
    element.scrollIntoView({ behavior: 'smooth'})
  }

  #clickOutsideHandler(event) {
    if (!this.element.contains(event.target)) {
      this.hide()
    }
  }
}
