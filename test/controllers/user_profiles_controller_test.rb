require "test_helper"

class UserProfilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_profile = user_profiles(:one)
  end

  test "should get index" do
    get user_profiles_url
    assert_response :success
  end

  test "should get new" do
    get new_user_profile_url
    assert_response :success
  end

  test "should create user_profile" do
    assert_difference("UserProfile.count") do
      post user_profiles_url, params: { user_profile: { age: @user_profile.age, name: @user_profile.name, name_jp: @user_profile.name_jp, user_id: @user_profile.user_id } }
    end

    assert_redirected_to user_profile_url(UserProfile.last)
  end

  test "should show user_profile" do
    get user_profile_url(@user_profile)
    assert_response :success
  end

  test "should get edit" do
    get edit_user_profile_url(@user_profile)
    assert_response :success
  end

  test "should update user_profile" do
    patch user_profile_url(@user_profile), params: { user_profile: { age: @user_profile.age, name: @user_profile.name, name_jp: @user_profile.name_jp, user_id: @user_profile.user_id } }
    assert_redirected_to user_profile_url(@user_profile)
  end

  test "should destroy user_profile" do
    assert_difference("UserProfile.count", -1) do
      delete user_profile_url(@user_profile)
    end

    assert_redirected_to user_profiles_url
  end
end
