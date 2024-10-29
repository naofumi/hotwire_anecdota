class User < ApplicationRecord
  has_many :tasks, dependent: :destroy
  has_many :likes, dependent: :destroy
end
