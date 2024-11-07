class SectionPage < Sitepress::Model
  collection glob: "**/*.html*"
  data :title
end
