/*
* # AriaExpanded controller
*
* The menu appears on a mouseenter event on the trigger element.
* The menu disappears on a mouseleave event on the div surrounding the trigger and the menu.
*
* The HTML should be like the following
*
* <!-- Profile menu -->
* <div class="relative ml-3"
*      data-controller="menu"
*      data-action="mouseleave->dropdown#hide">
*   <button type="button" data-action="mouseenter->menu#show" aria-expanded="false">
*      [button that will cause the menu to appear.
*   </button>
*
*   <div data-menu-target="menu"
*        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-0 scale-95"
*        data-dropdown-target="menu"
*        role="menu"
*        aria-orientation="vertical"
*        aria-labelledby="user-menu-button"
*        tabindex="-1">
*     [The menu that appears]
*   </div>
* </div>
*
* Targets
* * menuTargets: The menus that will be shown and hidden in response to the show() and hide() actions. Classes
*
* # Aria attribute discussion
*
* Aria attributes can be used in CSS selectors to drive the display of components.
* However, unlike CSS, Aria attributes do not follow a strict hierarchy. In the
* current dropdown example, `aria-expanded` will indicate the open/close state
* of the dropdown menu and is set on the trigger (in the above case, a button tag).
* However, the menu element (optionally specified with `aria-owns` or `aria-controls`)
* does not have to be a descendent of the trigger element in Aria. Therefore, CSS
* cannot be reliably used to change the display state of the menu element.
*
* Hence, although it makes sense to opportunistically use aria attributes as
* CSS selectors to change display state, we cannot always do this. We have to
* use a mix of regular CSS classes and aria attributes to drive display state.
*
* This names of the CSS classes should represent the component. The BEM convention
* seems to make sense in this regard.
*
* The additional benefit of not relying solely on aria attributes is that the CSS
* will be less depended on the HTML structure. The display elements can be specified
* directly with the CSS classes and not with a hierarchy of selectors spawning from
* the aria attribute.
*
* # Usage
* 1. Create the HTML for the dropdown component
* 2. Set `data-dropdown-target="control"` on the trigger element
* 3. Set `data-dropdown-target="menu"` on the menu element
* 4. Write CSS classes for `dropdown__menu--opened` and `dropdown__menu--closed`
*
* */

import {Controller} from "@hotwired/stimulus"

const openedClass = "dropdown__menu--opened"
const closedClass = "dropdown__menu--closed"

// Connects to data-controller="dropdown"
export default class AriaExpandedController extends Controller {
  static targets = ["control", "menu"]

  connect() {
  }

  show(event) {
    this.controlTargets.forEach((target) => target.ariaExpanded = true)
    
    this.menuTargets.forEach(target => {
      target.classList.remove(closedClass)
      target.classList.add(openedClass)
    })
  }

  hide(event) {
    this.controlTargets.forEach((target) => target.ariaExpanded = false)
    
    this.menuTargets.forEach(target => {
      target.classList.remove(openedClass)
      target.classList.add(closedClass)
    })
  }
}
