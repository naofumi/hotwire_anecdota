import {createRoot} from "react-dom/client"

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded")
  const rootElement = document.getElementById("root")
  const key = rootElement.dataset.page
  const root = createRoot(rootElement)

  const dispatchImport =  dispatcher(key)
  if (!dispatchImport) {
    alert(`No dispatcher found for "${key}"`)
  }
  const {default: component} = await dispatchImport()
  root.render(component());
});

// Page transition
window.addEventListener("load", () => {
  console.log("loaded")
  const overlay = document.getElementById("overlay")
  setTimeout(() => {
    overlay.classList.add("opacity-0", "collapse")
  }, 100)
})

function dispatcher(key) {
  const table = {
    "toggle": () => import("./react/pages/TogglePage"),
    "second": () => import("./react/pages/SecondPage"),
  }
  return table[key]
}
