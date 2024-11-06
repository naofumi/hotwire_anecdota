import {Controller} from "@hotwired/stimulus"
import {createRoot} from "react-dom/client"
import React from "react"
import Greeting from "../react/components/Greeting"
import Counter from "../react/components/Counter"

/*
* # ReactController
*
* Wraps React components in a Stimulus controller.
* This allows you to insert React components into your page without importing
* them directly in the HTML.
* You can also specify the props for the React components as Stimulus Values.
* Any changes to the Stimulus Values will be automatically propagated to the React component
* and will cause a re-render.
* This provides an easy way to externally alter the React components' state.
*
* */
// Connects to data-controller="react"
export default class extends Controller {
  static values = {
    component: String, props: Object
  }

  initialize() {
    this.root = createRoot(this.element)
  }

  connect() {
  }

  propsValueChanged() {
    this.#render()
  }

  #render() {
    this.root.render(
      ComponentDispatcher({
        component: this.componentValue, props: this.propsValue
      })
    )
  }
}

function ComponentDispatcher({component, props}) {
  const dispatchTable = {
    greeting: <Greeting {...props} />,
    counter: <Counter {...props} />,
  }
  return dispatchTable[component]
}
