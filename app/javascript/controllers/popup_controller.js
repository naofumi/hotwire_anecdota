import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="popup"
export default class extends Controller {
  static targets = ["popup"]
  static outlets = ["popup"]

  connect() {
  }

  show() {
    this.popupTarget.show()
  }

  close() {
    this.popupTarget.close()
  }

  showPopup(event) {
    this.popupOutlets.forEach( outlet => {
      if (outlet.element !== this.element) {
        outlet.close()
      } else {
        outlet.show()
      }
    })
  }
}
