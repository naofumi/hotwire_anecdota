module BreadcrumbsHelper
  # set_breadcrumbs [[name1, url1], [name2, url2], ...]
  def set_breadcrumbs(breadcrumbs_array)
    content_for(:breadcrumbs) do
      render "breadcrumbs", breadcrumbs: breadcrumbs_array
    end
  end
end
