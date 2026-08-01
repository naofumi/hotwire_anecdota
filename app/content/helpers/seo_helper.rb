module SeoHelper
  SITE_ORIGIN = ENV.fetch("SITE_ORIGIN", "https://frontend.naofumi.dev").delete_suffix("/")

  def canonical_url
    "#{SITE_ORIGIN}#{request.path}"
  end
end
