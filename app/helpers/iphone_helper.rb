module IphoneHelper
  def item_pricing(model, ram, catalog)
    [ "From #{number_to_currency catalog.pricing_for(model, ram).lump, locale: :en}",
     "or #{number_to_currency catalog.pricing_for(model, ram).monthly, locale: :en}/mo.",
     "for 24 mo." ]
  end
end
