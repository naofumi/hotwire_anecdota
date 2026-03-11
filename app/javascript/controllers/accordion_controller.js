import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="accordion"
export default class extends Controller {
  static targets = ["revealable", "trigger"]

  connect() {
    this.#syncContentA11y()
  }

  toggle() {
    this.triggerTarget.ariaExpanded = this.#isExpanded()
                                      ? "false"
                                      : "true"
    this.#toggleRevealableTargets()
    this.#syncContentA11y()
  }

  #isExpanded() {
    return this.triggerTarget.ariaExpanded == "true"
  }

  #syncContentA11y() {
    this.revealableTargets.forEach(target => {
      if (this.#isExpanded()) {
        target.ariaHidden = "false"
        target.inert = false
      } else {
        target.ariaHidden = "true"
        target.inert = true
      }
    })
  }

  #toggleRevealableTargets() {
    this.revealableTargets.forEach(target => {
      /*
      * CSS transitions cannot transition if the destination height
      * is not explicitly specified (like height: auto).
      * Hence, we get the scrollHeight with JavaScript and
      * explicitly set that value as the destination height.
      * */
      if (parseInt(target.style.height)) {
        target.style.height = 0
      } else {
        const scrollHeight = target.scrollHeight
        target.style.height = scrollHeight + "px"
      }
    })
  }
}
