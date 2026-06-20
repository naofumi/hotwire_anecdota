module BreadcrumbsHelper
  # set_breadcrumbs [[name1, url1], [name2, url2], ...]
  def set_breadcrumbs_plus_examples_crumb(breadcrumbs_array)
    content_for(:breadcrumbs) do
      render "breadcrumbs", breadcrumbs: [%w[コード例 /examples]] + breadcrumbs_array
    end
  end
end
