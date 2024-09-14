class Activity < ApplicationRecord
  belongs_to :trackable, polymorphic: true
end
