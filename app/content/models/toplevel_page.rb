class ToplevelPage < Sitepress::Model
  collection glob: "index.html*"
  data :sections

  def section_title_for(section_label)
    sections.unmanage.find { |_title, label| label == section_label }.first
  end
end
