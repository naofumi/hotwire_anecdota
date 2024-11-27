# frozen_string_literal: true

require "test_helper"

module Hotels
  class FeaturesControllerTest < ActionDispatch::IntegrationTest
    def setup
      @hotel = hotels(:manareaserina)
    end


    test "index should return success" do
      get hotel_features_path(@hotel)

      assert_response :success
    end

    test "room should return success" do
      get room_hotel_features_path(@hotel)

      assert_response :success
    end
  end
end
