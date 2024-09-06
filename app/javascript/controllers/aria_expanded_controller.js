/*
* # AriaExpanded controller
*
* The expandable appears on a mouseenter event on the trigger element.
* The expandable disappears on a mouseleave event on the div surrounding the trigger and the expandable.
*
* The HTML should be like the following
*
* <!-- Profile aria-expanded -->
* <div class="relative ml-3" data-controller="aria-expanded" data-action="mouseleave->dropdown#hide">
*   <div data-action="mouseenter->aria-expanded#show">
*     <button type="button">
*        [button that will cause the expandable to appear.
*     </button>
*   </div>
*
*   <div data-aria-expanded-target="expandable" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-0 scale-95" role="expandable" aria-orientation="vertical" aria-labelledby="user-expandable-button" tabindex="-1">
*     [The expandable that appears]
*   </div>
* </div>
*
* Targets
* * expandableTargets: The expandables that will be shown and hidden in response to the show() and hide() actions. Classes
* * showClasses, hideClasses: The classes added/removed from the expandable in the show() and hide() actions.
*
* # Discussion
*
* ## How to take advantage of aria attributes?
* Aria attributes are designed around the idea of controls. We have attributes like
* `aria-expanded` and `aria-checked`, etc. These convey state information about the control.
* Although you could use `input` state for form input tags, aria attributes provide
* and alternative that you can use on other HTML elements and are ideal. It means that
* if you use aria-oriented Stimulus controllers, you will automatically become more accessible.
*
* ## Should the aria attributes trigger display changes, or should they be independent?
*
* To allow aria attributes to trigger display changes through CSS/Tailwind, the aria attribute
* has to be set on an ancestor element of the one that changes. This will often not
* be the case. For example, an `aria-expanded` attribute may control a popup through
* `aria-controls` or `aria-owns` but there is no restriction on where these elements
* may appear.
*
* To accommodate the necessary flexibility, aria-attributes and display-changes should
* generally be separate.
*
* This means the following
* 1. Display changes should not depend on the presence of aria-attributes.
* 2. We do, however, change aria attributes based on state changes.
* 3. Target names, if appropriate, will mirror aria attribute names
*
* */

import {Controller} from "@hotwired/stimulus"
import {classTokenize} from "../utlitilies";

const DefaultShowClasses = classTokenize("transform opacity-100 scale-100 visible transition-all ease-out duration-200")
const DefaultHideClasses = classTokenize("transform opacity-0 scale-95 collapse transition-all ease-in duration-75")

// Connects to data-controller="aria-expanded"
export default class AriaExpandedController extends Controller {
  static targets = ["expandable", "control"]
  static classes = ["show", "hide"]

  connect() {
  }

  show(event) {
    this.controlTargets.forEach((target) => target.ariaExpanded = true)
    this.expandableTargets.forEach(target => {
      target.classList.remove(...this.#hideClassesWithDefaults())
      target.classList.add(...this.#showClassesWithDefaults())
    })
  }

  hide(event) {
    this.controlTargets.forEach((target) => target.ariaExpanded = false)
    this.expandableTargets.forEach(target => {
      target.classList.remove(...this.#showClassesWithDefaults())
      target.classList.add(...this.#hideClassesWithDefaults())
    })
  }

  #showClassesWithDefaults() {
    return this.showClasses.length
           ? this.showClasses
           : DefaultShowClasses
  }

  #hideClassesWithDefaults() {
    return this.hideClasses.length
           ? this.hideClasses
           : DefaultHideClasses
  }
}
