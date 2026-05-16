import $ from "jquery"

/* Since we are using type=module, we do not need to use $() to wait for the
* ready event
* */

const components = $("[data-js='click-user-row']")
const frame = $("#user-profile")
const highlightClass = "bg-yellow-200"

components.each(function (index, el) {
  init(el)
})

function init(el: HTMLElement) {
  const component = $(el)

  component.on("click", function (event) {
    event.preventDefault();
    select(component)

    frame.load(component.data('href'))
  })
}

function select(component: JQuery<HTMLElement>) {
  components.removeClass(highlightClass)
  component.addClass(highlightClass)
}
