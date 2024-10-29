module Likable
  extend ActiveSupport::Concern

  included do
    has_many :likes, as: :likable
  end

  def like!(user)
    likes.create!(user: user)
  end

  def unlike!(user)
    like_to_delete = likes.find_by!(user: user)
    likes.destroy(like_to_delete)
  end
end
