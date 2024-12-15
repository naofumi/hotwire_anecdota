class ReactController < ApplicationController
  include ViewTemplateCollectable
  collect_view_templates from_directory: "react"

  before_action :set_template, only: [ :show ]
  layout "react_layout"

  def show
    render template_full_path(@template)
  end

  def iphone
    @catalog_data = Catalog.data
    render :iphone, layout: "react_iphone"
  end

  private

    def set_template
      @template = params[:id].presence_in(view_templates)
      raise ActionController::RoutingError, "Not Found" unless @template
    end
end
