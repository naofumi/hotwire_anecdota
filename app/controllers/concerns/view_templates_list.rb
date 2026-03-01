class ViewTemplatesList
  def initialize(controller_path:)
    base = Rails.root.join("app/views/#{controller_path}")
    @controller_path = controller_path
    @templates = Dir.glob("**/*.html.erb", base:)
                    .reject { filepath_is_index? it }
                    .reject { filepath_is_partial? it }
                    .map { it.chomp(".html.erb") }
  end

  def view_templates
    @templates
  end

  class << self
    def template_full_path(template:, controller_path:)
      "#{controller_path}/#{template}"
    end
  end

  private

    def filepath_is_index?(filepath)
      File.basename(filepath) == "index.html.erb"
    end

    def filepath_is_partial?(filepath)
      File.basename(filepath)[0] == "_"
    end
end
