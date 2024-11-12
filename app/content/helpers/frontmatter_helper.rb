module FrontmatterHelper
  def page_showable?(page)
    !Rails.env.production? || page.data.published
  end

  def page_block_unless_published!(page)
    if Rails.env.production? && !page.data.published
      raise AbstractController::ActionNotFound
    end
  end
end
