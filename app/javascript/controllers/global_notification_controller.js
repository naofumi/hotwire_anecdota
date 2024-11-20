import {Controller} from "@hotwired/stimulus"
import {classTokenize} from "../utilities/utilities";

// Connects to data-controller="global-notification"
export default class extends Controller {
  static values = { shown: {type: Boolean, default: true} }
  static targets = ["toast"]

  connect() {
  }

  close() {
    this.shownValue = false
    // The CSS transition has a duration of 100ms, so we remove the DOM element
    // after allowing the transition to finish.
    setInterval(() => this.element.remove(), 200)
  }

  /*
  * The @starting-style CSS @rule allows you to set starting values on transitions
  * when an element is first added to the DOM. https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style#description
  *
  * However, since this is still an experimental feature as of Nov. 2024, we use a
  * JavaScript workaround.
  * */
  toastTargetConnected(element) {
    // We wait 10 ms to allow the DOM to render with the Toast in the hidden state and then
    // show the Toast.
    setTimeout(() => {
      this.shownValue = true
    }, 10)
  }
}
