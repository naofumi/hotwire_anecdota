import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="accordion"
export default class extends Controller {
  static targets = ["revealable", "switch"]
  static classes = ["toggleSwitch"]

  connect() {
  }

  toggle(event) {
    this.#toggleRevealableTargets()
    this.#toggleSwitchTargets()
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

  #toggleSwitchTargets() {
    this.switchTargets.forEach(target => {
      target.classList.toggle(this.toggleSwitchClass)
    })
  }
}
