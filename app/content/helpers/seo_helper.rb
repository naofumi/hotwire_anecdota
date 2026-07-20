module SeoHelper
  def canonical_url
    "#{request.base_url}#{request.path}"
  end
end
