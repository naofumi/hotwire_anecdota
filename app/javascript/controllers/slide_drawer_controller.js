import { Controller } from "@hotwired/stimulus"

/*
* SlideDrawer
* ====
*
* This is a controller for modal dialogs with a backdrop.
* You can directly show()/hide() or you can control the state remotely
* from a DrawerTriggerController or the data-slide-drawer-show-value attribute.
*
* This current implementation is for a slide-drawer, but it can also be used for
* regular modal dialogs.
* */
// Connects to data-controller="slide-drawer"
export default class extends Controller {
  static values = {show: {type: Boolean, default: false}};
  static targets = ["backdrop", "drawer"]
  // example:
  // backdropHide: "!opacity-0 invisible"
  // drawerHide: "translate-x-[768px]"
  static classes = ["backdropHide", "drawerHide"]

  connect() {
  }

  show() {
    this.showValue = true
    this.#render()
  }

  hide() {
    this.showValue = false
    this.#render()
  }

  #render() {
    if (this.showValue) {
      this.backdropTarget.classList.remove(...this.backdropHideClasses)
      this.drawerTarget.classList.remove(...this.drawerHideClasses)
      document.body.style.overflow = "hidden"
    } else {
      this.backdropTarget.classList.add(...this.backdropHideClasses)
      this.drawerTarget.classList.add(...this.drawerHideClasses)
      document.body.style.overflow = "auto"
    }
  }
}
