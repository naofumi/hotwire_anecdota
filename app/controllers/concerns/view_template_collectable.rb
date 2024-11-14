module ViewTemplateCollectable
  extend ActiveSupport::Concern

  class_methods do
    def collect_view_templates(view_directory)
      base = Rails.root.join("app/views/#{view_directory}")
      @@templates = Dir.glob("*", base:)
                       .map { _1.split(".").first }
                       .filter { _1 =~ /\A[a-z]/ }
    end
  end

  def view_templates
    @@templates
  end
end
