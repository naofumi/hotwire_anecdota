class User < ApplicationRecord
  has_many :tasks, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_one :user_profile, dependent: :destroy
end
