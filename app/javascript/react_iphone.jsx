import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import IphoneOption from "./react/components/IphoneOption"
import IphoneColorOption from "./react/components/IphoneColorOption"

document.addEventListener("DOMContentLoaded", () => {
  const dataJSON = document.getElementById('catalog-data').textContent
  const data = JSON.parse(dataJSON)

  const root = createRoot(document.getElementById("root"))
  root.render(<IPhone catalogData={data} />);
});

function IPhone({catalogData}) {
  const [model, setModel] = useState("6-1inch")
  const [color, setColor] = useState("naturaltitanium")
  const [ram, setRam] = useState("256GB")

  function imagePath(model, color) {
    return catalogData.images[`${model}-${color}`]
  }

  function fullColorName(color) {
    return catalogData.colors[color].full_name
  }

  function price(model, ram) {
    const modelPrice = catalogData.prices.model[model]
    const ramPrice = catalogData.prices.ram[ram]

    return {lump: modelPrice.lump + ramPrice.lump, monthly: modelPrice.monthly + ramPrice.monthly}
  }

  function pricingFor(model, ram) {
    const modelPricing = catalogData.prices.model[model]
    const ramPricing = catalogData.prices.ram[ram]

    return {
      lump: modelPricing.lump + ramPricing.lump,
      monthly: modelPricing.monthly + ramPricing.monthly,
    }
  }

  function itemPricing(model, ram) {
    const pricing = pricingFor(model, ram)
    return [`From \$${pricing.lump.toFixed(2)}`, `or \$${pricing.monthly.toFixed(2)}/mo.`, "for 24 mo."]
  }

  function handleModelChange(model) {
    setModel(model)
  }

  function handleColorChange(color) {
    setColor(color)
  }

  function handleRamChange(ram) {
    setRam(ram)
  }

  return (<div className="relative">
    <div className="text-xl z-10 font-bold sticky top-14 right-0 h-8 w-full">
      <div className="ml-auto p-2 bg-white text-center w-[400px] shadow">
        <span>{`From ${price(model, ram).lump.toFixed(2)} or ${price(model, ram).monthly.toFixed(2)}`} </span>
        for 24 mo.*
      </div>
    </div>

    <div className="pt-12 pb-6">
      <h1 className="text-5xl">Buy iPhone 15 Pro</h1>
      <div className="text-sm mt-4 text-light">From $1399 or $58.29/mo. for 24 mo.<sup>*</sup></div>
    </div>

    <div className="flex">
      <div className="shrink-0 sticky top-0 w-[592px] h-[460px]">
        <img src={imagePath(model, color)} className="object-cover w-[592px] h-[460px] rounded-[20px]" alt="iphone-image"/>
      </div>
      <div className="pl-10">
        <div>
          <h2 className="mb-6 text-2xl">Model. <span className="text-gray-400">Which is best for you?</span></h2>
          <div>
            <fieldset className="disabled:opacity-30">
              <IphoneOption
                name="model"
                value="6-1inch"
                selected={model === "6-1inch"}
                title="iPhone 15 Pro"
                subtitle="6.1-inch display"
                pricingLines={itemPricing("6-1inch", ram)}
                handleOptionChange={handleModelChange}
              />
              <IphoneOption
                name="model"
                value="6-7inch"
                selected={model === "6-7inch"}
                title="iPhone 15 Pro Max"
                subtitle="6.7-inch display"
                pricingLines={itemPricing("6-7inch", ram)}
                handleOptionChange={handleModelChange}
              />
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
            <div className="text-xl my-4" data-iphone-static-target="colorText"></div>
            <fieldset className="disabled:opacity-30">
              <IphoneColorOption
                value="naturaltitanium"
                color="bg-gray-400"
                selected={color === "naturaltitanium"}
                handleColorChange={handleColorChange}
                />
              <IphoneColorOption
                value="bluetitanium"
                color="bg-indigo-400"
                selected={color === "bluetitanium"}
                handleColorChange={handleColorChange}
              />
              <IphoneColorOption
                value="whitetitanium"
                color="bg-white"
                selected={color === "whitetitanium"}
                handleColorChange={handleColorChange}
              />
              <IphoneColorOption
                value="blacktitanium"
                color="bg-black"
                selected={color === "blacktitanium"}
                handleColorChange={handleColorChange}
              />
            </fieldset>
          </div>
        </div>

        <div className="mt-48">
          <h2 className="mb-6 text-2xl">Storage. <span className="text-gray-400">How much space do you need?</span></h2>
          <div>
            <fieldset className="disabled:opacity-30">
              <IphoneOption
                name="ram"
                value="256GB"
                selected={ram === "256GB"}
                title="256GB<sup>2</sup>"
                pricingLines={itemPricing(model, "256GB")}
                handleOptionChange={handleRamChange}
              />
              <IphoneOption
                name="ram"
                value="512GB"
                selected={ram === "512GB"}
                title="512GB<sup>*</sup>"
                pricingLines={itemPricing(model, "512GB")}
                handleOptionChange={handleRamChange}
              />
              <IphoneOption
                name="ram"
                value="1TB"
                selected={ram === "1TB"}
                title="1TB<sup>2</sup>"
                pricingLines={itemPricing(model, "1TB")}
                handleOptionChange={handleRamChange}
              />
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
  </div>)
}

