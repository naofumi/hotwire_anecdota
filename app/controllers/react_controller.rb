class ReactController < ApplicationController
  include ViewTemplateCollectable
  collect_view_templates "react"

  # AVAILABLE_TEMPLATES = %w[ iphone toggle second]
  before_action :set_template, only: [:show]
  # before_action :set_data
  layout "react_layout"

  def show
    render @template
  end

  def iphone
    @catalog_data = Catalog.data
    render :iphone, layout: "react_iphone"
  end

  private

    def set_template
      @template = params[:id].presence_in(view_templates)
      raise ActionController::RoutingError.new("Not Found") unless @template
    end
end
