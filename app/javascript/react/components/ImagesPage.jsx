import React from "react"
import avatarImage from "../../../assets/images/myavatar.webp"
import catImage from "../../../assets/images/orange-tabby-cat-dribbble.jpg"
import logoImage from "../../../assets/images/content_images/avatar.webp"

export default function ImagesPage() {
  return <div className="container container-lg mx-auto px-4 pt-16">
    <div className="mx-auto min-w-[1028px] lg:max-w-5xl">
      <h1 className="text-5xl">Images Page</h1>
      <p className="text-base my-8">This page demonstrates how you can load assets using jsbundling rails and esbuild.</p>
      <div className="my-8">
      <a href="https://github.com/rails/jsbundling-rails?tab=readme-ov-file#how-can-i-reference-static-assets-in-javascript-code" className="text-orange-600 underline">jsbundling-rails gem</a>
      </div>
      <div className="flex flex-wrap gap-4 my-8">
        <img src={avatarImage} alt="" className="w-24 aspect-auto"/>
        <img src={catImage} alt="" className="w-24 aspect-auto"/>
        <img src={logoImage} alt="" className="w-24 aspect-auto"/>
      </div>
    </div>
  </div>
}

