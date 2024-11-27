class ComponentsController < ApplicationController
  include ViewTemplateCollectable
  collect_view_templates "components"

  before_action :set_template, only: [ :show ]
  before_action :set_data, only: [ :show ]

  def index
    @available_templates = view_templates
    @available_projects = available_projects
    @available_react_templates = ReactController::AVAILABLE_TEMPLATES
  end

  def show
    render @template
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

    def set_data
      @catalog_data = Catalog.data if @template == "iphone"
    end

    def set_template
      @template = params[:id].presence_in(view_templates)
      raise ActionController::RoutingError.new("Not Found") unless @template
    end
end
