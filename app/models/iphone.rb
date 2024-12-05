class Iphone
  def initialize(iphone_session)
    @iphone_session = iphone_session
    @catalog = Catalog.new
  end

  def state
    if @iphone_session["ram"] then :ram_entered
    elsif @iphone_session["color"] then :color_entered
    elsif @iphone_session["model"] then :model_entered
    else
      :nothing_entered
    end
  end

  def model_enterable?
    true
  end

  def color_enterable?
    state.in? [ :model_entered, :color_entered, :ram_entered ]
  end

  def ram_enterable?
    state.in? [ :color_entered, :ram_entered ]
  end

  def model=(string)
    return unless model_enterable?

    @iphone_session["model"] = string
  end

  def model
    @iphone_session["model"]
  end

  def color=(string)
    return unless color_enterable?

    @iphone_session["color"] = string
  end

  def color
    @iphone_session["color"]
  end

  def ram=(string)
    return unless ram_enterable?

    @iphone_session["ram"] = string
  end

  def ram
    @iphone_session["ram"]
  end

  def color_name
    @catalog.color_name(color)
  end

  def image_path
    @catalog.image_path(model, color)
  end

  def pricing
    @catalog.pricing(model, ram)
  end

  def to_hash
    { model:, color:, color_name: }
  end
end
