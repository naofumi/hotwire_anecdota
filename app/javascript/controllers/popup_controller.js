import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="popup"
export default class extends Controller {
  static targets = ["popup", "control"]
  static outlets = ["popup"]

  connect() {
  }

  show() {
    this.controlTarget.ariaExpanded = "true"

    this.popupTarget.show()
  }

  close(event) {
    if (!this.popupTarget.open) { return true }

    this.controlTarget.ariaExpanded = "false"

    this.popupTarget.close()
  }

  toggle() {
    if (this.popupTarget.open) {
      this.close()
    } else {
      this.show()
    }
  }

  showAndHideOthers(event) {
    this.popupOutlets.forEach( outlet => {
      if (outlet.element !== this.element) {
        outlet.close()
      } else {
        outlet.show()
      }
    })
  }

  toggleAndHideOthers(event) {
    this.popupOutlets.forEach( outlet => {
      if (outlet.element !== this.element) {
        outlet.close()
      } else {
        outlet.toggle()
      }
    })
  }
}
