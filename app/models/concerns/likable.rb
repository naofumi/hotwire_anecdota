module Likable
  extend ActiveSupport::Concern

  included do
    has_many :likes, as: :likable
  end

  def like!(user)
    raise ArgumentError unless user

    likes.create!(user: user)
  end

  def unlike!(user)
    raise ArgumentError unless user

    like_to_delete = likes.find_by!(user: user)
    likes.destroy(like_to_delete)
  end

  def like?(user)
    raise ArgumentError unless user

    likes.where(user: user).exists?
  end

  def likes_count
    likes.count
  end
end
