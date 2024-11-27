require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:sazae)
  end

  test "should get index" do
    get users_url
    assert_response :success
  end
end
