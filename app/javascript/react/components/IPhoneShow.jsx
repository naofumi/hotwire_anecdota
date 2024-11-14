import React, {useState} from "react"
import IPhone from "./models/IPhone"
import IphoneOption from "./react/components/IphoneOption"
import IphoneColorOption from "./react/components/IphoneColorOption"

export function IPhoneShow({catalogData}) {
  const [iPhoneState, setIphoneState] = useState(
    {model: null, color: null, ram: null}
  )
  const [colorText, setColorText] = useState("Color – Natural Titanium")

  const iPhone = new IPhone(iPhoneState, catalogData)

  function handleOptionChange(name, value) {
    setIphoneState({...iPhoneState, [name]: value})
  }

  function handleColorChange(color) {
    setIphoneState({...iPhoneState, color})
  }

  function handleSetColorText(selectedColor) {
    setColorText(catalogData.colors[selectedColor].full_name)
  }

  function handleResetColorText() {
    setColorText(iPhone.fullColorName())
  }

  function itemPricing(model, ram) {
    const pricing = iPhone.pricingFor(model, ram)
    return [`From \$${pricing.lump.toFixed(2)}`, `or \$${pricing.monthly.toFixed(2)}/mo.`, "for 24 mo."]
  }

  return (<>
      <div className="text-xl z-10 font-bold sticky top-0 right-0 h-8 w-full">
        <div className="animate-bounce ml-auto p-2 bg-white text-center w-[400px]">
          <span>{`From ${iPhone.price().lump.toFixed(2)} or ${iPhone.price().monthly.toFixed(2)}`} </span>
          for 24 mo.*
        </div>
      </div>

      <div className="pt-12 pb-6">
        <div className="float-right mr-6">
          <a href="" className="bg-orange-600 p-1 border rounded text-white active:bg-orange-700">Clear Order</a>
        </div>
        <h1 className="text-5xl">Buy iPhone 15 Pro</h1>
        <div className="text-sm mt-4 text-light">From $1399 or $58.29/mo. for 24 mo.<sup>*</sup></div>
      </div>

      <div className="flex">
        <div className="shrink-0 sticky top-0 w-[592px] h-[460px]">
          <img src={iPhone.imagePath()} className="object-cover w-[592px] h-[460px] rounded-[20px]"
               alt="iphone-image"/>
        </div>
        <div className="pl-10">
          <div>
            <h2 className="mb-6 text-2xl">Model. <span className="text-gray-400">Which is best for you?</span></h2>
            <div>
              <fieldset disabled={!iPhone.canEnterModel()} className="disabled:opacity-30">
                {[{model: "6-1inch", title: "iPhone 15 Pro", subtitle: "6.1-inch display"},
                  {model: "6-7inch", title: "iPhone 15 Pro Max", subtitle: "6.7-inch display"}
                ].map(attributes => <IphoneOption
                  name="model"
                  value={attributes.model}
                  selected={iPhone.model === attributes.model}
                  title={attributes.title}
                  subtitle={attributes.subtitle}
                  pricingLines={itemPricing(attributes.model, iPhone.ram)}
                  handleOptionChange={handleOptionChange}
                />)}
              </fieldset>
              <div className="flex justify-between mt-4 p-4 block bg-gray-100 rounded-lg w-full">
                <div className="text-sm">
                  <div className="font-bold">Need help choosing a model?</div>
                  <div className="font-light">Explore the differences in screen size and battery life</div>
                </div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-48">
            <h2 className="mb-6 text-2xl">Finish. <span className="text-gray-400">Pick your favorite</span></h2>
            <div>
              <div className="text-xl my-4">
                {colorText}
              </div>
              <fieldset disabled={!iPhone.canEnterColor()} className="disabled:opacity-30">
                {
                  [{color: "naturaltitanium", class: "bg-gray-400"},
                    {color: "bluetitanium", class: "bg-indigo-800"},
                    {color: "whitetitanium", class: "bg-white"},
                    {color: "blacktitanium", class: "bg-black"}
                  ].map(attributes => <IphoneColorOption
                    value={attributes.color}
                    color={attributes.class}
                    selected={iPhone.color === attributes.color}
                    handleColorChange={handleColorChange}
                    handleSetColorText={handleSetColorText}
                    handleResetColorText={handleResetColorText}
                  />)
                }
              </fieldset>
            </div>
          </div>

          <div className="mt-48">
            <h2 className="mb-6 text-2xl">Storage. <span className="text-gray-400">How much space do you need?</span>
            </h2>
            <div>
              <fieldset disabled={!iPhone.canEnterRam()} className="disabled:opacity-30">
                {[{value: "256GB", title: "256GB<sup>2</sup>"},
                  {value: "512GB", title: "512GB<sup>*</sup>"},
                  {value: "1TB", title: "1TB<sup>2</sup>"},
                ].map(attributes => <IphoneOption
                  name="ram"
                  value={attributes.value}
                  selected={iPhone.ram === attributes.value}
                  title={attributes.title}
                  pricingLines={itemPricing(iPhone.model, attributes.value)}
                  handleOptionChange={handleOptionChange}
                />)}
              </fieldset>
              <div className="flex justify-between mt-4 p-4 block bg-gray-100 rounded-lg w-full">
                <div className="text-sm">
                  <div className="font-bold">Need help choosing a model?</div>
                  <div className="font-light">Explore the differences in screen size and battery life</div>
                </div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
