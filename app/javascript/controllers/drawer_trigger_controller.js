import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="drawer-trigger"
export default class extends Controller {
  static outlets = ["slide-drawer"]
  connect() {
  }

  show() {
    this.slideDrawerOutlets.forEach(drawer => drawer.show())
  }
}
