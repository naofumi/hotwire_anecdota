import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="modal-dialog"
export default class extends Controller {
  static values = {
    shown: {type: Boolean, default: false},
    page: String
  }

  connect() {
    this.pageElement = document.querySelector(this.pageValue)
  }

  show(event) {
    this.shownValue = true
  }

  hide(event) {
    this.shownValue = false
  }

  hideOnSuccess(event) {
    if (!event.detail.success) return

    this.hide(event)
  }

  // Used to prevent browser default behavior on specific elements.
  void(event) {
  }

  shownValueChanged() {
    if (this.shownValue) {
      this.#makePageUnresponsive()
    } else {
      this.#restorePageResponsiveness()
    }
  }

  #makePageUnresponsive() {
    this.pageElement.inert = true
  }

  #restorePageResponsiveness() {
    setTimeout(() => this.pageElement.inert = false, 100)
  }
}
