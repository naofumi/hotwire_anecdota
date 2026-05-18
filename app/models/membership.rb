class Membership < ApplicationRecord
  validates :name, :email, :valid_to, :valid_from, presence: true
  validates :email, uniqueness: true
  validates :company_name, presence: true, if: :membership_type_company?
  validate :valid_to_is_equal_or_later_than_valid_from

  enum :membership_type, { personal: "personal", company: "company" }, prefix: true, validate: true

  private

    def valid_to_is_equal_or_later_than_valid_from
      return unless valid_to.present? && valid_from.present?

      if valid_to < valid_from
        errors.add(:valid_to, "must be equal or later than valid from")
        errors.add(:valid_from, "must be equal or earlier than valid from")
      end
    end
end
