module Room::Reservable
  extend ActiveSupport::Concern

  included do
    # If current_reservation is provided, it will exclude the room night with that reservation from the query
    scope :reserved_during, lambda { |check_in, check_out, current_reservation = nil|
      joins(:room_nights).merge(RoomNight.where(date: check_in...check_out).where.not(reservation: current_reservation)).distinct
    }
    # If current_reservation is provided, room nights for that reservation will be available.
    scope :unavailable, lambda { |category, check_in, check_out, current_reservation = nil|
      category(category).reserved_during(check_in, check_out, current_reservation).distinct
    }
    # If current_reservation is provided, room nights for that reservation will be available.
    # This is useful when updating a reservation.
    scope :available, lambda { |category, check_in, check_out, current_reservation = nil|
      where.not(id: unavailable(category, check_in, check_out, current_reservation)).distinct
    }

    has_many :room_nights, dependent: :destroy
  end
end
