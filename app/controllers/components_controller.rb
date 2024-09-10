class ComponentsController < ApplicationController
  AVAILABLE_TEMPALTES = %w[toggle select tabs navigation tiers_with_toggle]

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
      { "一休.com tracing" => hotels_path,
        "Apple.com iPhone" => iphone_path,
        "Apple.com iPhone サーバ通信少" => iphone_client_side_path,
        "Todo: List animations" => todos_path}
    end
end
