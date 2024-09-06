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

// Connects to data-controller="tablist"
export default class extends Controller {
  connect() {
  }

  select(event) {
    const selected = event.currentTarget
    this.element.querySelectorAll("[aria-current]")
      .forEach((e) => {e.ariaCurrent = "false"})
    selected.ariaCurrent = "page"

    this.element.querySelectorAll(".tablist__tab--selected")
      .forEach(e => e.classList.remove("tablist__tab--selected"))
    selected.classList.add("tablist__tab--selected")

    if (event.params.content) {
      document.querySelectorAll(".tablist__content--shown")
        .forEach(e => {
          e.classList.remove("tablist__content--shown")
          e.classList.add("tablist__content--hidden")
        })
      document.querySelectorAll(event.params.content)
        .forEach(e => {
          e.classList.remove("tablist__content--hidden")
          e.classList.add("tablist__content--shown")
        })
    }
  }
}
