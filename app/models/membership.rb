class Membership < ApplicationRecord
  validates :name, :email, presence: true
  validates :email, uniqueness: true
  validates :company_name, presence: true, if: :membership_type_company?

  enum :membership_type, { personal: "personal", company: "company" }, prefix: true, validate: true
end
