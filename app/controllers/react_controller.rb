class ReactController < ApplicationController
  AVAILABLE_TEMPLATES = %w[ iphone first second]
  before_action :set_template
  before_action :set_data
  layout "react_layout"

  def show
    render @template
  end

  private

    def set_data
      @catalog_data = Catalog.data if @template == "iphone"
    end

    def set_template
      @template = params[:id].presence_in(AVAILABLE_TEMPLATES)
      raise ActionController::RoutingError.new("Not Found") unless @template
    end
end
