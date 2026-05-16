module ReservationsHelper
  ReservationDateSpan = Struct.new(:from, :to)

  def reservation_date_span(reservation)
    check_in = reservation.check_in
    check_out = reservation.check_out
    if check_in
      if check_out
        ReservationDateSpan.new(from: check_in, to: check_out - 1.day) if check_in < check_out
      else
        ReservationDateSpan.new(from: check_in, to: check_in + 1.week - 1.day)
      end
    end
  end
end
