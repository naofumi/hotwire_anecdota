/*
* I have written the same feature in jQuery to compare it with Stimulus.
*
* - Stimulus encourages you to write your code according to certain conventions.
* - Well-written jQuery code often follows very similar conventions which I have also
*   here for discussion purposes.
* - Stimulus automatically attaches and detaches controllers, etc. based on the
*   Mutation Observer API.
*   This makes it significantly easier to manage event handlers when your DOM is
*   being updated by Turbo Frames or Turbo Streams.
* - jQuery does not provide this feature and care must be taken when working with
*   dynamically rendered DOM.
* */

/*
* Since we are using type=module, this JavaScript is automatically deferred and
* will execute after DOMContentLoaded.
* Therefore, we do not need to use $() to wait for the ready event
* */

import $ from "jquery"

/*
* Many jQuery code-bases adopt a convention to clarify the association between
* an HTML element and JavaScript.
*
* In our example, HTML elements with a `data-js='accordion'` attribute will be connected to
* a jQuery component described in the `accordion.js` file.
* This makes it easy to see whether an HTML element has jQuery behavior
* associated with it or not.
*
* This is similar to how Stimulus uses `data-controller='accordion'` to connect to
* HTML elements to controllers.
* */
const components = $("[data-js='accordion']")

/*
* Stimulus controllers will be automatically connected.
* With jQuery, we manually init each component.
* */
components.each(function (index, el) {
  init(el)
})

/*
* Well-written jQuery code makes it easy to see what is
* happening inside the initialization function.
*
* Typically, we define event targets, triggers, and attach event handlers to the triggers.
* */
function init(el: HTMLElement) {
  const component = $(el)
  /*
  * In well-written jQuery code, the triggers and the
  * targets are defined at the beginning of the `init()` function
  * so that it is easy to understand what elements are associated
  * with this jQuery function.
  * This also helps to cache the elements so that you do not have
  * to run `find()` multiple times.
  *
  * Note that `find()` is scoped on the `component` element.
  * This makes the code easier to understand by allowing you to
  * focus on the current component.
  *
  * The following code is similar to how you would define the targets, states,
  * classes and outlets at the beginning of Stimulus controllers.
  * */
  const trigger = component.find("[data-js='accordion-toggle']")
  const revealableTargets = component.find("[data-js='accordion-revealable']")

  /*
  * Event handlers are attached here.
  *
  * Like Rails controllers, I typically keep event handlers slim and
  * any complicated logic is extracted into its own function.
  * */
  trigger.on("click", function (event) {
    event.currentTarget.ariaExpanded = event.currentTarget.ariaExpanded === "true"
                                       ? "false"
                                       : "true"
    toggleRevealables(revealableTargets)
  })
}

/*
* To reduce clutter, it is a good idea to extract logic into functions.
* In Stimulus, these would be independent functions or private methods.
* */
function toggleRevealables(revealableTargets: JQuery<HTMLElement>) {
  revealableTargets.each(function (index, el) {
    if (parseInt(el.style.height)) {
      el.style.height = "0"
    } else {
      const scrollHeight = el.scrollHeight
      el.style.height = scrollHeight + "px"
    }
  })
}
