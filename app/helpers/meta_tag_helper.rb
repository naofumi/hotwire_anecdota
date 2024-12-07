module MetaTagHelper
  def default_meta_tags(url: request.original_url, title: "Hotwire Anecdota")
    image = image_url('ogp.webp')
    {
      og: {
        site_name: 'Hotwire Anecodota',
        title:,
        # description: '',
        type: 'website',
        url:,
        image: image,
        thumbnail: image,
        locale: 'ja_JP',
      },
      twitter: {
        card: 'summary_large_image',
        site: '@naofumi',
        title:,
        image: image,
      },
      fb: {
        app_id: '',
      },
    }
  end
end
