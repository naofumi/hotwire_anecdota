require "test_helper"

class HotelsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @hotel = hotels(:manareaserina)
  end

  test "should get index" do
    get hotels_url

    assert_redirected_to hotel_url(Hotel.first)
  end

  test "should show hotel" do
    get hotel_url(@hotel)
    assert_response :success
  end
end
