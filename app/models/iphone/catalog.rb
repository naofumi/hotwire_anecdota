class Iphone::Catalog
  Price = Data.define(:lump, :monthly)
  DEFAULT_MODEL = "6-1inch"
  DEFAULT_COLOR = "naturaltitanium"
  DEFAULT_RAM = "256GB"

  def pricing(model, ram)
    pricing_for(model, ram)
  end

  def image_path(model, color)
    "iphone_images/smartphone-image-#{model || DEFAULT_MODEL}-#{color || DEFAULT_COLOR}.webp"
  end

  def color_name(color)
    color_name_for_value(color)
  end

  def color_name_for_value(value)
    color_table = {
      "naturaltitanium" => "Color – Natural Titanium",
      "bluetitanium" => "Color – Blue Titanium",
      "whitetitanium" => "Color – White Titanium",
      "blacktitanium" => "Color – Black Titanium"
    }
    color_table[value || DEFAULT_COLOR]
  end

  def pricing_for(model, ram)
    Price.new(lump: 0, monthly: 0).then do |price|
      case model || DEFAULT_MODEL
      when "6-1inch" then Price.new(lump: price.lump + 999, monthly: price.monthly + 41.62)
      when "6-7inch" then Price.new(lump: price.lump + 1199, monthly: price.monthly + 49.95)
      else raise "bad model: #{model}"
      end
    end.then do |price|
      case ram || DEFAULT_RAM
      when "256GB" then price
      when "512GB" then Price.new(lump: price.lump + 200, monthly: price.monthly + 8.34)
      when "1TB" then Price.new(lump: price.lump + 400, monthly: price.monthly + 26.77)
      end
    end
  end
end
