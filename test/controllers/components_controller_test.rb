require "test_helper"

class ComponentsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get components_path

    assert_response :success
  end

  test "get show comoponents/toggle_stimulus returns success" do
    get component_path(:toggle_stimulus)

    assert_response :success
  end
end
