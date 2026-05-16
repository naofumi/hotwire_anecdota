class Reservation < ApplicationRecord
  has_many :room_nights, dependent: :destroy
  belongs_to :requested_room, class_name: "Room"

  validates :guest_name, :guest_phone, :check_in, :check_out, :requested_room, presence: true
  validate :ensure_checkout_equal_or_later_than_check_in

  before_validation :create_room_nights
  after_validation :modify_error_message

  private

    def ensure_checkout_equal_or_later_than_check_in
      return unless check_in.present? && check_out.present?

      errors.add(:check_out, "must be equal to or later than check-in date") if check_out <= check_in
    end

    def create_room_nights
      return unless check_in.present? && check_out.present?

      self.room_nights = (check_in...check_out).map do |room_night_date|
        room_nights.find_by(date: room_night_date, room: requested_room) ||
          room_nights.build(date: room_night_date, room: requested_room)
      end
    end

    def modify_error_message
      if room_nights.any? { it.errors.of_kind? :date, :taken }
        errors.tap { it.delete :room_nights, :invalid }
              .tap { it.add :room_nights, " date is already taken" }
      end
    end
end
