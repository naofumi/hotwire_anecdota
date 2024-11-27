require "test_helper"

class UserProfilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_profile = user_profiles(:sazae)
  end

  test "should show user_profile" do
    selector_mock = Minitest::Mock.new.expect :validated_variant, :jquery, [ nil ]
    Variantable::VariantSelector.stub :new, selector_mock do
      get user_user_profile_url(@user_profile.user)
      assert_response :success
    end
  end
end
