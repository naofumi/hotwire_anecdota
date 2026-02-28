module ViewTemplatesListable
  extend ActiveSupport::Concern

  included do
    @view_templates_list = ViewTemplatesList.new(controller_path:)
  end

  def view_templates
    self.class.instance_variable_get(:@view_templates_list).view_templates
  end

  def template_full_path(template)
    ViewTemplatesList.template_full_path(template:, controller_path:)
  end
end
