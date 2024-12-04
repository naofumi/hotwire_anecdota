module FrontmatterHelper
  def page_showable?(page, show_published_only: false)
    editor_viewable?(show_published_only:) || page.data.published
  end

  def editor_viewable?(show_published_only: false)
    !Rails.env.production? && !show_published_only
  end

  def page_block_unless_published!(page)
    if Rails.env.production? && !page.data.published
      raise AbstractController::ActionNotFound
    end
  end
end
