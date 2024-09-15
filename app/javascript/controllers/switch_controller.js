import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="switch"
/*
* Assumes something like the following
*
* <button type="button"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        role="switch"
        aria-checked="false"
        data-controller="aria-checked"
        data-action="click->aria-checked#toggle"
 ></button>
*
* Toggles the value of `aria-checked`
*
* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-checked
*
* `aria-checked` is used in the following roles
* * checkbox: Has "checked" (true), "not checked" (false) and "indeterminate" (mixed) states.
* * menuitemcheckbox
* * menuitemradio
* * option: Optional for selections in a listbox
* * radio
* * switch: Identical to the checkbox role, but represents "on" (true) and "off" (false) states.
*           Maybe better for certain buttons.
* */
export default class extends Controller {
  static targets = ["toggle"]
  static classes = ["elementOn", "elementOff", "toggleOn", "toggleOff"]
  connect() {
  }

  toggle() {
    this.element.ariaChecked = this.element.ariaChecked === "true" ? "false" : "true"

    this.element.classList.toggle(this.elementOnClass)
    this.element.classList.toggle(this.elementOffClass)
    this.toggleTarget.classList.toggle(this.toggleOnClass)
    this.toggleTarget.classList.toggle(this.toggleOffClass)
  }
}
