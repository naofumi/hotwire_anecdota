module FrontmatterHelper
  def page_showable?(page, show_published_only: false)
    editor_viewable?(show_published_only:) || page.data.published
  end

  def editor_viewable?(show_published_only: false)
    !Rails.env.production? && !show_published_only
  end

  def hide_page_unless_published!(page)
    return if page_showable?(page)

    raise AbstractController::ActionNotFound
  end
end
