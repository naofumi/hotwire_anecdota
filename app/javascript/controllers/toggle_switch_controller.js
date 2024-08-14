import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="toggle-switch"
/*
* Assumes something like the following
*
* <button type="button"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        role="switch"
        aria-checked="false"
        data-controller="toggle-switch"
        data-action="click->toggle-switch#toggle"
 ></button>
*
* Toggles the value of `aria-checked`
*
* */
export default class extends Controller {
  connect() {
  }

  toggle() {
    this.element.ariaChecked = this.element.ariaChecked === "true" ? "false" : "true"
  }
}
