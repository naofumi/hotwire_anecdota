class ComponentsController < ApplicationController
  AVAILABLE_TEMPALTES = %w[
    toggle select tabs navigation tiers_with_toggle
    accordion dropdown_menu static_tabs radio_tabs
  ]

  def index
    @available_templates = AVAILABLE_TEMPALTES
    @available_projects = available_projects
  end

  def show
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
end
