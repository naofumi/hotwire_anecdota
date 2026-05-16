require "test_helper"

class RoomNightsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @room_night = room_nights(:one)
  end

  test "should get index" do
    get room_nights_url
    assert_response :success
  end

  test "should get new" do
    get new_room_night_url
    assert_response :success
  end

  test "should create room_night" do
    assert_difference("RoomNight.count") do
      post room_nights_url,
           params: { room_night: { booking_id: @room_night.booking_id, date: @room_night.date,
                                   room_id: @room_night.room_id } }
    end

    assert_redirected_to room_night_url(RoomNight.last)
  end

  test "should show room_night" do
    get room_night_url(@room_night)
    assert_response :success
  end

  test "should get edit" do
    get edit_room_night_url(@room_night)
    assert_response :success
  end

  test "should update room_night" do
    patch room_night_url(@room_night),
          params: { room_night: { booking_id: @room_night.booking_id, date: @room_night.date,
                                  room_id: @room_night.room_id } }
    assert_redirected_to room_night_url(@room_night)
  end

  test "should destroy room_night" do
    assert_difference("RoomNight.count", -1) do
      delete room_night_url(@room_night)
    end

    assert_redirected_to room_nights_url
  end
end
