import {Controller} from "@hotwired/stimulus"
import {createRoot} from "react-dom/client"
import React from "react"
import Greeting from "../react/components/Greeting"
import Counter from "../react/components/Counter"

// Connects to data-controller="react"
export default class extends Controller {
  static targets = ["insert"]
  static values = {
    selector: String, props: Object
  }

  connect() {
    const root = createRoot(this.insertTarget)
    root.render(Dispatcher({selector: this.selectorValue, props: this.propsValue}));
  }
}

function Dispatcher({selector, props}) {
  const dispatchTable = {
    greeting: <Greeting message={props.message}/>,
    counter: <Counter initialValue={props.initialValue}/>,
  }
  return dispatchTable[selector]
}
