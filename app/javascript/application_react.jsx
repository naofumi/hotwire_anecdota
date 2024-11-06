import {createRoot} from "react-dom/client"
import React from "react"
import Greeting from "./react/components/Greeting"
import Counter from "./react/components/Counter"


document.addEventListener("turbo:load", () => {
  const root = createRoot(document.getElementById("root"))
  root.render(<>
    <div><Greeting message="Hello World! from Embedded React"/></div>
    <div className="mt-8"><Counter initialValue={3}/></div>
    <div className="mt-8"><Counter initialValue={5}/></div>
  </>);
});
