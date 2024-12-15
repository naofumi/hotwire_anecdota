module ViewTemplateCollectable
  extend ActiveSupport::Concern

  class_methods do
    def collect_view_templates(from_directory:)
      base = Rails.root.join("app/views/#{from_directory}")
      @from_directory = from_directory
      @templates = Dir.glob("**/*.html.erb", base:)
                      .reject { filepath_is_index? _1 }
                      .reject { filepath_is_partial? _1 }
                      .map { _1.chomp(".html.erb") }
    end

    private

      def filepath_is_index?(filepath)
        File.basename(filepath) == "index.html.erb"
      end

      def filepath_is_partial?(filepath)
        File.basename(filepath)[0] == "_"
      end
  end

  def view_templates
    self.class.instance_variable_get(:@templates)
  end

  def template_full_path(template)
    from_directory = self.class.instance_variable_get(:@from_directory)
    "#{from_directory}/#{template}"
  end
end
