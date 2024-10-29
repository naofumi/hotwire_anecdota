class Bucket < ApplicationRecord
  has_many :tasks, dependent: :destroy
end
