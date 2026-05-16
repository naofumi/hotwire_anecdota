class Room < ApplicationRecord
  default_scope { order(number: :desc) }
  include Reservable

  enum :category, { single: "single", double: "double", superior: "superior", suite: "suite" }

  scope :category, ->(category) { category && where(category: category) }

  has_one_attached :feature_image do |attachable|
    attachable.variant :thumb, resize_to_limit: [ 300, 300 ]
  end
end
