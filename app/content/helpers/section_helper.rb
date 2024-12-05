module SectionHelper
  def current_section_from(request)
    request.original_fullpath.match(%r{/([^/]+)/})[1]
  end
end
