import {createRoot} from "react-dom/client"
import React from "react"
import {FirstPage} from "./react/pages/FirstPage"
import {SecondPage} from "./react/pages/SecondPage"

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded")
  const rootElement = document.getElementById("root")
  const root = createRoot(rootElement)

  root.render(dispatcher(rootElement.dataset.page));
  console.log("rendered")
});

window.addEventListener("load", () => {
  console.log("loaded")
  const overlay = document.getElementById("overlay")
  setTimeout(() => {
    overlay.classList.add("opacity-0", "collapse")
    console.log("overlay removed")
  }, 100)
})

function dispatcher(key) {
  const table = {
    "first": <FirstPage />,
    "second": <SecondPage />,
  }
  return table[key]
}
