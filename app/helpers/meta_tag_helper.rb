module MetaTagHelper
  def default_meta_tags(url: request.original_url, title: "Hotwire Anecdota", description: "")
    image = image_url("ogp.webp")
    {
      og: {
        site_name: "Hotwire Anecdota",
        title:,
        # description: '',
        type: "website",
        url:,
        image: image,
        thumbnail: image,
        locale: "ja_JP",
        description:
      },
      twitter: {
        card: "summary_large_image",
        site: "@naofumi",
        title:,
        image: image,
        description:
      },
      fb: {
        app_id: ""
      },
      description:
    }
  end
end
