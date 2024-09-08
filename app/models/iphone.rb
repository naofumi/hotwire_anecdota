class Iphone
  Price = Data.define(:lump, :monthly)

  def initialize(iphone_session)
    @iphone_session = iphone_session
  end

  def state
    case
    when @iphone_session["ram"] then :ram_entered
    when @iphone_session["color"] then :color_entered
    when @iphone_session["model"] then :model_entered
    else :nothing_entered
    end
  end

  def model_enterable?
    true
  end

  def color_enterable?
    state.in? [:model_entered, :color_entered, :ram_entered]
  end

  def ram_enterable?
    state.in? [:color_entered, :ram_entered]
  end

  def model=(string)
    return unless model_enterable?
    @iphone_session["model"] = string
  end

  def model
    @iphone_session["model"] || "6-1inch"
  end

  def color=(string)
    return unless color_enterable?
    @iphone_session["color"] = string
  end

  def color
    @iphone_session["color"] || "naturaltitanium"
  end

  def ram=(string)
    return unless ram_enterable?
    @iphone_session["ram"] = string
  end

  def ram
    @iphone_session["ram"] || "256GB"
  end

  def color_name
    color_name_for_value(color)
  end

  def color_name_for_value(value)
    table = {
      "naturaltitanium" => "Color – Natural Titanium",
      "bluetitanium" => "Color – Blue Titanium",
      "whitetitanium" => "Color – White Titanium",
      "blacktitanium" => "Color – Black Titanium"
    }
    table[value]
  end

  def image_path
    "iphone_images/iphone-15-pro-finish-select-202309-#{model}-#{color}.webp"
  end

  def pricing
    Iphone.pricing_for(model, ram)
  end

  def self.pricing_for(model = "6-1inch", ram = "256GB")

    Price.new(lump: 0, monthly: 0).then do |price|
      case model
      when "6-1inch" then Price.new(lump: price.lump + 999, monthly: price.monthly + 41.62)
      when "6-7inch" then Price.new(lump: price.lump + 1199, monthly: price.monthly + 49.95)
      else raise "bad model: #{model}"
      end
    end.then do |price|
      case ram
      when "256GB" then price
      when "512GB" then Price.new(lump: price.lump + 200, monthly: price.monthly + 8.34)
      when "1TB" then Price.new(lump: price.lump + 400, monthly: price.monthly + 26.77)
      end
    end
  end

  def to_hash
    { model:, color:, color_name: }
  end
end
