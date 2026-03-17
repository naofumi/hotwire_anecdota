class SectionPage < Sitepress::Model
  # collection glob: "**/*.html*"
  data :title

  def self.all
    glob("**/*.html*")
  end
end
