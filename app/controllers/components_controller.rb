class ComponentsController < ApplicationController
  @@available_templates = %w[toggle select tabs navigation]
  def index
    @available_templates = @@available_templates
  end

  def show
    template = params[:id].presence_in(@@available_templates)
    raise ActionController::RoutingError.new("Not Found") unless template
    render template
  end
end
