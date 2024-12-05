class Feature < ApplicationRecord
  belongs_to :hotel
  enum :category, { topic: 0, room: 1, restaurant: 2, service: 3, basic_info: 4 }
end
