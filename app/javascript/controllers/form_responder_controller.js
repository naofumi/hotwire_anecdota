import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="form-responder"
export default class extends Controller {
  connect() {
  }

  respondWithReload(event) {
    if (event.detail.success) {
      Turbo.visit(document.location.href, {action: "replace"})
    }
  }
}
