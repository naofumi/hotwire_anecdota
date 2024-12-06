/*
* # Purpose of React inside the Hotwire Anecdota project.
*
* 1. Provide examples of embedding React inside Turbo or MPA pages.
* 2. Study React-based UI libraries.
*
* Despite router libraries for React, there are a large number of
* websites using React embedded inside MPA pages.
* This is a good approach to add reactivity to the few pages where
* reactivity is important, while keeping the rest of your site simple.
*
* Examples of sites using React embedded in an MPA
* * Apple Store
* * https://camp.travel.rakuten.co.jp
*
* */
import React, {Suspense, lazy} from "react"
import {createRoot} from "react-dom/client"

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded")
  const rootElement = document.getElementById("root")
  const key = rootElement.dataset.page
  const root = createRoot(rootElement)

  const dispatchImport =  dispatcher(key)
  if (!dispatchImport) {
    alert(`No dispatcher found for "${key}". Add a dispatcher to app/javascript/application_react.jsx`)
  }
  const MyComponent = lazy(dispatchImport)
  root.render(<Suspense fallback={<div>Loading...</div>}>
    <MyComponent />
  </Suspense>)
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
    "customers": () => import("./react/pages/CustomersPage"),
    "images": () => import("./react/pages/ImagesPage"),
  }
  return table[key]
}
