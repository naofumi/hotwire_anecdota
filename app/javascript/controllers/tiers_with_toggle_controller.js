import {Controller} from "@hotwired/stimulus"
import get from "lodash/get"

/*
* Limited Client-side rendering
* ==========
*
* In this pattern, we send in data through the `data-price-table-value` attribute on
* the controller, and render certain "slots" in the HTML.
*
* The data looks like this.
* We use Lodash `get` to specify which data goes into each slot
* ```
* {
*   "freelancer" => {"monthly" => "$15", "annually" => "$144"},
*   "startup" => {"monthly" => "$30", "annually" => "$288"},
*   "enterprise" =>  {"monthly" => "$60", "annually" => "$576"}
* }
* ```
* */
// Connects to data-controller="tiers-with-toggle"
export default class extends Controller {
  static values = {frequency: String, priceTable: Object}
  static targets = ["slot", "frequency"]

  connect() {
    this.#render()
  }

  setFrequency(event) {
    this.frequencyValue = event.params.frequency
    this.#render()
  }

  #render() {
    this.#updateFrequencyToggle()
    this.#updatePrices()
  }

  #updateFrequencyToggle() {
    document.querySelectorAll(`input[type=radio][name=frequency]`)
      .forEach(e=> {
        e.checked = e.value === this.frequencyValue ? true : false
      })
  }

  #updatePrices() {
    const priceTable = this.priceTableValue

    this.slotTargets.forEach(slot => {
      const plan = slot.dataset.tierPath
      // Use Lodash get (https://lodash.com/docs/4.17.15#get) to
      // allow flexibile retrieval of data from the `data-tier-path` attribute
      slot.textContent = get(priceTable, `${plan}.${this.frequencyValue}`)
    })
  }
}
