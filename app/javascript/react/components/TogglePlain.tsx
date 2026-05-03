import React from "react"
import Layout from "./Layout"

export default function Toggle() {
  return <Layout title="React Toggle" description="React版 Toggle">
    <div className="text-center">
      <TogglePlain/>
    </div>
  </Layout>
}

export function TogglePlain() {
  const [enabled, setEnabled] = React.useState(false)

  function clickHandler() {
    setEnabled(!enabled)
  }

  return (
    <button type="button"
            className="group bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
                   focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
             aria-checked:bg-indigo-600"
            role="switch"
            tabIndex={0}
            aria-checked={enabled
                          ? "true"
                          : "false"}
            onClick={clickHandler}
    >
      <span className="sr-only">Use setting</span>
      <span aria-hidden="true"
            className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0
                   transition duration-200 ease-in-out
                   group-aria-checked:translate-x-5"
      ></span>
    </button>
  )
}
