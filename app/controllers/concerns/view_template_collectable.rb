module ViewTemplateCollectable
  extend ActiveSupport::Concern

  class_methods do
    def collect_view_templates(view_directory)
      base = Rails.root.join("app/views/#{view_directory}")
      @templates = Dir.glob("*", base:)
                       .map { _1.split(".").first } # remove extension
                       .reject { _1 == "index" } # remove index
                       .filter { _1 =~ /\A[a-z]/ } # remove partials
    end
  end

  def view_templates
    self.class.instance_variable_get(:@templates)
  end
end
