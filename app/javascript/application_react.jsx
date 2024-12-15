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
// We cannot dynamically generate import statements because
// esbuild won't be able to include the imports in the build.
const DispatchImports = {
  "headless/Button": () => import("./react/components/headless/ButtonPage"),
  "headless/Checkbox": () => import("./react/components/headless/CheckboxPage"),
  "headless/Combobox": () => import("./react/components/headless/ComboboxPage"),
  "Toggle": () => import("./react/components/Toggle"),
  "Customers": () => import("./react/components/CustomersPage"),
  "Images": () => import("./react/components/ImagesPage"),
}

document.addEventListener("DOMContentLoaded", async () => {
  reactableComponents().forEach(component => renderReactComponent(component))
});

function reactableComponents() {
  return document.querySelectorAll("[data-react-component]")
}

// To include a React Component, create an HTML element like the following;
//
//   <div id="root" data-react-component="Toggle" data-props="{&quot;foo&quot;:&quot;bar&quot;}"></div>
//
// where the value of the data-props is JSON that has been HTML params escaped.
function renderReactComponent(component) {
  const rootElement = component
  const key = rootElement.dataset.reactComponent
  const root = createRoot(rootElement)
  const props = JSON.parse(rootElement.dataset.props || {})

  const dispatchImport =  dispatcher(key)
  if (!dispatchImport) {
    alert(`No dispatcher found for "${key}". Add a Dispatch Import to app/javascript/application_react.jsx`)
  }
  const MyComponent = lazy(dispatchImport)
  root.render(<Suspense fallback={<div></div>}>
    <MyComponent {...props} />
  </Suspense>)
}

function dispatcher(key) {
  if (!DispatchImports[key]) {
    console.error(`No dispatcher found for "${key}". Add a dispatcher to app/javascript/application_react.jsx`)
  } else {
    return DispatchImports[key]
  }
}
