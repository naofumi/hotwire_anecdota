import {Controller} from "@hotwired/stimulus"
import {classTokenize} from "../utilities/utilities";

// Connects to data-controller="global-notification"
export default class extends Controller {
  static values = {version: Number}

  // Morphing tends to morph the contents of the controller
  // without disconnecting. Therefore, `connect()` will not be
  // called. Instead, send a `version` value in the controller
  // sent through morphing. This will trigger versionValueChanged()
  // and so you can respond to it.
  connect() {
  }

  close() {
    this.element.classList.remove(...classTokenize("transform ease-out duration-300 transition opacity-100"))
    this.element.classList.add(...classTokenize("transition ease-in duration-500 opacity-0"))
  }

  /*
  * This is a workaround to enable transitions on load without using
  * @starting-style (which is not yet supported by Tailwind).
  *
  * We detect that a new notification has been sent through the version value
  * on the controller. Then we initially render the screen with the css classes
  * from the server, and update them later with a setTimeout.
  *
  * @starting-style should make this unnecessary since it can set the transition
  * start style.
  *
  * With React, useEffect separates the initial rendering from later renders,
  * and this replaces setTimeout.
  *
  * */
  versionValueChanged(value, previousValue) {
    console.log("Value changed")
    setTimeout(() => {
      this.element.classList.remove(...classTokenize("translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"));
      this.element.classList.add(...classTokenize("translate-y-0 opacity-100 sm:translate-x-0"));
    }, 100)
  }
}
