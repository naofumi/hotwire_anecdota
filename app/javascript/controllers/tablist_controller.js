/*
* # Tablist
*
* Use this to select a tab within a tablist.
* This implementation specifies the currently selected tab
* using the `aria-current` attribute. This may not be appropriate
* if the tab is small and the contents do not represent a full-page.
* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current
*
* With MPA/TurboDrive/TurboFrames, it is common to simply select the
* current tab on the new page rendered on the server, without providing
* immediate feedback to the user other than the CSS `:active`
* pseudo-selector. The current approach, however, provides feedback
* to the user immediately after the tab is clicked. This may or
* may not be preferable, depending on server latency and other UI
* elements.
*
* */

import { Controller } from "@hotwired/stimulus"
import {changeClasses} from "../utlitilies";

// Connects to data-controller="tablist"
export default class extends Controller {
  static targets = ["control"]
  static classes = ["selected"]
  connect() {
  }

  select(event) {
    const selected = event.currentTarget

    this.#setAriaCurrent(selected)
    this.#selectTab(selected)
    this.#displayContent(event.params.content)
  }

  #setAriaCurrent(selected) {
    this.element.querySelectorAll("[aria-current]")
      .forEach(e => {
        e.ariaCurrent = "false"
      })
    selected.ariaCurrent = "page"
  }

  #selectTab(selected) {
    this.controlTargets.forEach(e => {
      e.classList.remove(...this.selectedClasses)
    })
    selected.classList.add(...this.selectedClasses)
  }

  #displayContent(selector) {
    if (selector) {
      changeClasses(".tablist__content--shown", {
        remove: "tablist__content--shown",
        add: "tablist__content--hidden"
      })
      changeClasses(selector, {
        remove: "tablist__content--hidden",
        add: "tablist__content--shown"
      })
    }
  }
}
