import React from "react"

export default function Layout({ title, description, children}: { title: string, description: string, children: React.ReactNode}) {
  return (<div className="mx-auto px-4 my-6 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="font-light text-6xl text-center">
          {title}
        </h1>
        <p className="mt-6 leading-6 text-lg text-center">
          {description}
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6 h-96">
        {children}
      </div>
    </div>
  )
}
