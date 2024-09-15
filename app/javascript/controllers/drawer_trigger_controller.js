import { Controller } from "@hotwired/stimulus"

/*
* This pattern is used when you want to place a control
* outside the Controller that executes the action.
*
* Since the outlet identifier (ex. "drawer-trigger") needs
* to be the same as the target controller's identifier,
* you need a separate trigger controller class for each
* target controller.
* (You cannot use duck typing)
* */
// Connects to data-controller="drawer-trigger"
export default class extends Controller {
  static outlets = ["slide-drawer"]
  connect() {
  }

  show() {
    this.slideDrawerOutlets.forEach(drawer => drawer.show())
  }
}
