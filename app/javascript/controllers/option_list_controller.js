import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="option-list"
export default class extends Controller {
  static targets = ["option"]

  connect() {
  }

  up(event) {
    const currentFocusable = document.activeElement
    const index = this.optionTargets.indexOf(currentFocusable)
    const nextIndex = this.#isWithinIndexRange(index - 1)
                      ? index - 1
                      : this.optionTargets.length - 1
    this.optionTargets[nextIndex].focus()
  }

  down(event) {
    const currentFocusable = document.activeElement
    const index = this.optionTargets.indexOf(currentFocusable)
    const nextIndex = this.#isWithinIndexRange(index + 1)
                      ? index + 1
                      : 0
    this.optionTargets[nextIndex].focus()
  }

  #isWithinIndexRange(index) {
    return ((0 <= index) && (index < this.optionTargets.length))
  }
}
