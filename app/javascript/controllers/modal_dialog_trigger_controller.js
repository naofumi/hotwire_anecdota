import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal-dialog-trigger"
export default class extends Controller {
  static outlets = [ "modal-dialog" ]

  connect() {
  }

  show() {
    this.modalDialogOutlets.forEach(modal => modal.show())
  }

  hide() {
    this.modalDialogOutlets.forEach(modal => modal.hide())
  }
}
