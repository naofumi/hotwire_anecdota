require "test_helper"

class ReservationTest < ActiveSupport::TestCase
  test "fixture is valid" do
    reservation = reservations(:masuo)
    assert reservation.valid?
  end

  test "invalid without guest_name" do
    reservation = reservations(:masuo)
    reservation.guest_name = nil
    assert reservation.invalid?
  end

  test "invalid without guest_phone" do
    reservation = reservations(:masuo)
    reservation.guest_phone = nil
    assert reservation.invalid?
  end

  test "invalid without check_in" do
    reservation = reservations(:masuo)
    reservation.check_in = nil
    assert reservation.invalid?
  end

  test "invalid without check_out" do
    reservation = reservations(:masuo)
    reservation.check_out = nil
    assert reservation.invalid?
  end

  test "invalid if check_in is after check_out" do
    reservation = reservations(:masuo)
    reservation.check_in = 2.days.from_now
    reservation.check_out = 1.day.from_now

    assert reservation.invalid?
  end

  test "invalid if check_in is same as check_out" do
    reservation = reservations(:masuo)
    reservation.check_in = 1.day.from_now
    reservation.check_out = 1.day.from_now

    assert reservation.invalid?
  end

  test "creates RoomNights on save" do
    reservation = Reservation.new(guest_name: "Hogeo",
                                  guest_phone: "090-1234-5678",
                                  requested_room_category: "single",
                                  check_in: Date.new(2030, 1, 1),
                                  check_out: Date.new(2030, 1, 2))
    reservation.save
    assert_not reservation.room_nights.empty?
    assert_equal 1, reservation.room_nights.size
    assert_equal Date.new(2030, 1, 1), reservation.room_nights.first.date
    assert(reservation.room_nights.all? { it.room.category == "single" })
  end

  test "fails to create RoomNight if full" do
    reservation = Reservation.new(guest_name: "Hogeo", guest_phone: "090-1234-5678", check_in: Date.new(2026, 5, 1),
                                  check_out: Date.new(2026, 5, 4))

    assert_no_changes -> { Reservation.count } do
      assert_no_changes -> { RoomNight.count } do
        reservation.save
      end
    end

    assert_includes reservation.errors.full_messages, "Room nights date is already taken"
  end

  test "updates Reservations and creates new RoomNights as necessary" do
    reservation = reservations(:masuo)
    reservation.guest_name = "Updated Name"
    reservation.check_out = Date.new(2026, 5, 4)
    reservation.save
    assert_equal "Updated Name", reservation.reload.guest_name
    assert_equal 3, reservation.room_nights.size
  end
end
