class Iphone
  def initialize(iphone_session)
    @iphone_session = iphone_session
  end

  def model=(string)
    @iphone_session['model'] = string
  end

  def model
    @iphone_session['model'] || "6-1inch"
  end

  def color=(string)
    @iphone_session['color'] = string
  end

  def color
    @iphone_session["color"] || "naturaltitanium"
  end

  def color_name
    color_name_for_value(color)
  end

  def color_name_for_value(value)
    table = {
      "naturaltitanium" => "Color – Natural Titanium",
      "bluetitanium" => "Color – Blue Titanium",
      "whitetitanium" => "Color – White Titanium",
      "blacktitanium" => "Color – Black Titanium",
    }
    table[value]
  end

  def image_path
    "iphone_images/iphone-15-pro-finish-select-202309-#{model}-#{color}.webp"
  end

  def to_hash
    {model:, color:, color_name:}
  end
end
