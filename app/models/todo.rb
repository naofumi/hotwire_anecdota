class Todo < ApplicationRecord
  include Likable

  validates :title, presence: true
end
