require "test_helper"

class UserProfilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_profile = user_profiles(:sazae)
  end

  test "should create user_profile" do
    assert_difference("UserProfile.count") do
      post user_user_profile_url(@user_profile.user), params: { user_profile: { age: @user_profile.age, name: @user_profile.name, name_jp: @user_profile.name_jp, user_id: @user_profile.user_id } }
    end

    assert_redirected_to user_user_profile_url(UserProfile.last.user)
  end

  test "should show user_profile" do
    selector_mock = Minitest::Mock.new.expect :validated_variant, :jquery, [nil]
    Variantable::VariantSelector.stub :new, selector_mock do
      get user_user_profile_url(@user_profile.user)
      assert_response :success
    end
  end

  test "should update user_profile" do
    patch user_user_profile_url(@user_profile.user), params: { user_profile: { age: @user_profile.age, name: @user_profile.name, name_jp: @user_profile.name_jp, user_id: @user_profile.user_id } }
    assert_redirected_to user_user_profile_url(@user_profile.user)
  end

  test "should destroy user_profile" do
    assert_difference("UserProfile.count", -1) do
      delete user_user_profile_url(@user_profile.user)
    end

    assert_redirected_to user_user_profile_url(@user_profile.user)
  end
end
