import React from "react"
import SimpleToggle from "../tailwindui/SimpleToggle"

export function FirstPage() {
  return <div>
    <h1 className="text-5xl">First React Page</h1>
    <a href="/react/second" className="underline text-orange-600">GOTO Second page</a>

    <SimpleToggle/>
  </div>
}

