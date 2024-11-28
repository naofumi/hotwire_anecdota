import React from "react"
import SimpleToggle from "../tailwindui/SimpleToggle"

export default function TogglePage() {
  return <div>
    <h1 className="text-5xl">Toggle Page</h1>
    <a href="/react/second" className="underline text-orange-600">GOTO Second page</a>


    <div><SimpleToggle/></div>
  </div>
}

