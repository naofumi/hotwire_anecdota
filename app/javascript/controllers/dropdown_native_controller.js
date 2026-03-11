import { Controller } from "@hotwired/stimulus"


// Connects to data-controller="dropdown"
export default class DropdownNativeController extends Controller {
  static targets = ["button"]

  connect() {
  }

  show(event) {
    this.#popoverElement().showPopover()
  }

  hide(event) {
    this.#popoverElement().hidePopover()
  }

  #popoverElement() {
    const popoverId = this.buttonTarget.getAttribute("popovertarget")
    return document.getElementById(popoverId)
  }
}
