/*
# Dropdown controller

* The menu appears on a mouseenter event on the trigger element.
* The menu disappears on a mouseleave event on the div surrounding the trigger and the menu.

The HTML should be like the following

<!-- Profile dropdown -->
<div class="relative ml-3" data-controller="dropdown" data-action="mouseleave->dropdown#hide">
  <div data-action="mouseenter->dropdown#show">
    <button type="button">
       [button that will cause the dropdown menu to appear.
    </button>
  </div>

  <div data-dropdown-target="menu" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-0 scale-95" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
    [The dropdown menu that appears]
  </div>
</div>

Targets
* menuTargets: The menus that will be shown and hidden in response to the show() and hide() actions.
Classes
* showClasses, hideClasses: The classes added/removed from the menu in the show() and hide() actions.
* */

import {Controller} from "@hotwired/stimulus"
import {classTokenize} from "../utlitilies";

const DefaultShowClasses = classTokenize("transform opacity-100 scale-100 visible transition-all ease-out duration-200")
const DefaultHideClasses = classTokenize("transform opacity-0 scale-95 collapse transition-all ease-in duration-75")

// Connects to data-controller="dropdown"
export default class DropdownController extends Controller {
  static targets = ["menu"]
  static classes = ["show", "hide"]

  connect() {
  }

  show() {
    this.menuTargets.forEach(target => {
      target.classList.remove(...this.#hideClasses())
      target.classList.add(...this.#showClasses())
    })
  }

  hide() {
    this.menuTargets.forEach(target => {
      target.classList.remove(...this.#showClasses())
      target.classList.add(...this.#hideClasses())
    })
  }

  #showClasses() {
    return this.showClasses.length
           ? this.showClasses
           : DefaultShowClasses
  }

  #hideClasses() {
    return this.hideClasses.length
           ? this.hideClasses
           : DefaultHideClasses
  }
}
