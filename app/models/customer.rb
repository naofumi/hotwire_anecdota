class Customer < ApplicationRecord
  validates :name, :jp_name, presence: true

  scope :search, lambda { |query|
    return all if query.blank?

    sanitized_query = sanitize_sql_like query
    Customer.where([ "name LIKE ? OR jp_name LIKE ?",
                     "%#{sanitized_query}%", "%#{sanitized_query}%" ])
  }
end
