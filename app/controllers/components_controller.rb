class ComponentsController < ApplicationController
  AVAILABLE_TEMPALTES = %w[
    toggle select tabs navigation tiers_with_toggle
    accordion dropdown_menu static_tabs radio_tabs
    iphone
  ]

  def index
    @available_templates = AVAILABLE_TEMPALTES
    @available_projects = available_projects
  end

  def show
    @catalog_data = catalog_data
    template = params[:id].presence_in(AVAILABLE_TEMPALTES)
    raise ActionController::RoutingError.new("Not Found") unless template
    render template
  end

  private

    def available_projects
      {
        "一休.com tracing" => hotels_path,
        "Apple.com iPhone" => iphone_path,
        "Todo: List animations with Notifications" => todos_path,
        "Files" => file_nodes_path,
        "Kanban" => board_path
      }
    end

    def catalog_data
      {
        colors: {
          "naturaltitanium" => { full_name: "Color – Natural Titanium" },
          "bluetitanium" => { full_name: "Color – Blue Titanium" },
          "whitetitanium" => { full_name: "Color – White Titanium" },
          "blacktitanium" => { full_name: "Color – Black Titanium" },
        },
        images: {
          "6-1inch-blacktitanium" => "iphone_images/iphone-15-pro-finish-select-202309-6-1inch-blacktitanium.webp",
          "6-1inch-bluetitanium" => "iphone_images/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium.webp",
          "6-1inch-naturaltitanium" => "iphone_images/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium.webp",
          "6-1inch-whitetitanium" => "iphone_images/iphone-15-pro-finish-select-202309-6-1inch-whitetitanium.webp",
          "6-7inch-blacktitanium" => "iphone_images/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium.webp",
          "6-7inch-bluetitanium" => "iphone_images/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium.webp",
          "6-7inch-naturaltitanium" => "iphone_images/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium.webp",
          "6-7inch-whitetitanium" => "iphone_images/iphone-15-pro-finish-select-202309-6-7inch-whitetitanium.webp",
        },
        prices: {
          model: {
            "6-1inch": { lump: 999, monthly: 41.62 },
            "6-7inch": { lump: 1199, monthly: 49.95 },
          },
          ram: {
            "256GB": { lump: 0, monthly: 0 },
            "512GB": { lump: 200, monthly: 8.34 },
            "1TB": { lump: 400, monthly: 26.77 },
          }
        }
      }
    end
end
