class Catalog
  DATA = {
    colors: {
      "naturaltitanium" => { full_name: "Color – Natural Titanium" },
      "bluetitanium" => { full_name: "Color – Blue Titanium" },
      "whitetitanium" => { full_name: "Color – White Titanium" },
      "blacktitanium" => { full_name: "Color – Black Titanium" }
    },
    images: {
      "6-1inch-blacktitanium" => "iphone_images/smartphone-image-6-1inch-blacktitanium.webp",
      "6-1inch-bluetitanium" => "iphone_images/smartphone-image-6-1inch-bluetitanium.webp",
      "6-1inch-naturaltitanium" => "iphone_images/smartphone-image-6-1inch-naturaltitanium.webp",
      "6-1inch-whitetitanium" => "iphone_images/smartphone-image-6-1inch-whitetitanium.webp",
      "6-7inch-blacktitanium" => "iphone_images/smartphone-image-6-7inch-blacktitanium.webp",
      "6-7inch-bluetitanium" => "iphone_images/smartphone-image-6-7inch-bluetitanium.webp",
      "6-7inch-naturaltitanium" => "iphone_images/smartphone-image-6-7inch-naturaltitanium.webp",
      "6-7inch-whitetitanium" => "iphone_images/smartphone-image-6-7inch-whitetitanium.webp"
    },
    prices: {
      model: {
        "6-1inch": { lump: 999, monthly: 41.62 },
        "6-7inch": { lump: 1199, monthly: 49.95 }
      },
      ram: {
        "256GB": { lump: 0, monthly: 0 },
        "512GB": { lump: 200, monthly: 8.34 },
        "1TB": { lump: 400, monthly: 26.77 }
      }
    }
  }

  class << self
    def data
      DATA
    end
  end
end
