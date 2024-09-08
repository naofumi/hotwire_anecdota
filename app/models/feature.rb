class Feature < ApplicationRecord
  belongs_to :hotel
  enum :category, [ :topic, :room, :restaurant, :service, :basic_info ]
end
