import React from "react"
import SimpleToggle from "./tailwindui/SimpleToggle"

export default function Toggle() {
  return <div className="container container-lg mx-auto px-4 pt-16">
    <div className="mx-auto min-w-[1028px] lg:max-w-5xl">
      <h1 className="text-5xl">Toggle Page</h1>
      <a href="/react/customers" className="underline text-orange-600">goto Customers page</a>
      <div><SimpleToggle/></div>
    </div>
  </div>
}

