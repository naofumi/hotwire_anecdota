require "test_helper"

class ReservationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @reservation = reservations(:masuo)
  end

  test "should get index" do
    get reservations_url
    assert_response :success
  end

  test "should get new" do
    get new_reservation_url
    assert_response :success
  end

  test "should create reservation" do
    assert_difference("Reservation.count") do
      post reservations_url,
           params: { confirmed: "1",
                     reservation: { check_in: "2030-01-01", check_out: "2030-01-02",
                                    guest_name: "Hogeo", guest_phone: "090-1234-5678",
                                    requested_room_id: rooms(:single_1).id } }
    end

    assert_redirected_to reservation_url(Reservation.last)
  end

  test "should show reservation" do
    get reservation_url(@reservation)
    assert_response :success
  end

  test "should get edit" do
    get edit_reservation_url(@reservation)
    assert_response :success
  end

  test "should update reservation" do
    patch reservation_url(@reservation),
          params: { confirmed: "1",
                    reservation: { check_in: @reservation.check_in, check_out: @reservation.check_out,
                                   guest_name: @reservation.guest_name, guest_phone: @reservation.guest_phone,
                                   requested_room_id: @reservation.requested_room_id } }
    assert_redirected_to reservation_url(@reservation)
  end

  test "should destroy reservation" do
    assert_difference("Reservation.count", -1) do
      delete reservation_url(@reservation)
    end

    assert_redirected_to reservations_url
  end
end
