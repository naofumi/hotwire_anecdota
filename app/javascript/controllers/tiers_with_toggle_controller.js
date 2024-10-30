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
  static values = {priceTable: Object}
  static targets = ["price", "frequency", "toggler"]

  connect() {
    this.#render()
  }

  setFrequency(event) {
    this.#render()
  }

  #frequency() {
    return this.togglerTargets.find(e => e.checked).value
  }

  #render() {
    this.#updatePrices()
    this.#updateFrequencyLabel()
  }

  #updatePrices() {
    const priceTable = this.priceTableValue

    this.priceTargets.forEach(priceTarget => {
      const plan = priceTarget.dataset.tierPath
      // Use Lodash get (https://lodash.com/docs/4.17.15#get) to
      // allow flexibile retrieval of data from the `data-tier-path` attribute
      priceTarget.textContent = get(priceTable, `${plan}.${this.#frequency()}`)
    })
  }

  #updateFrequencyLabel() {
    const frequencyText = this.#frequency() === "monthly" ? "/month" : "/year"

    this.frequencyTargets.forEach(e => e.textContent = frequencyText)
  }
}
