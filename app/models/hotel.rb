class Hotel < ApplicationRecord
  has_many :features, dependent: :destroy
  has_many :topic_features, -> { where(category: :topic) },
           class_name: "Feature",
           dependent: :destroy, inverse_of: :hotel
  has_many :room_features, -> { where(category: :room) },
           class_name: "Feature",
           dependent: :destroy, inverse_of: :hotel
end
