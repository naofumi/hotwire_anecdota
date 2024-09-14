class Task < ApplicationRecord
  belongs_to :user
  belongs_to :bucket
  has_many :activities, as: :trackable, dependent: :restrict_with_exception

  after_save :create_activity

  validates :name, presence: true

  private

    def create_activity
      if saved_change_to_bucket_id?
        old_bucket = Bucket.find(bucket_id_before_last_save)
        activities.create!(event: "bucket_changed", before: old_bucket.name, after: bucket.name)
      end
    end
end
