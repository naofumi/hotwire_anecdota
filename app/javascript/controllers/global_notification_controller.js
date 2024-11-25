import {Controller} from "@hotwired/stimulus"
import {classTokenize} from "../utilities/utilities";

// Connects to data-controller="global-notification"
export default class extends Controller {
  static values = { shown: {type: Boolean, default: true} }

  connect() {
  }

  close() {
    this.shownValue = false
    // The CSS transition has a duration of 100ms, so we remove the DOM element
    // after allowing the transition to finish.
    setInterval(() => this.element.remove(), 200)
  }
}
