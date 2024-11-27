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

  test "get show comoponents/non_existant_name returns 404" do
    assert_raises ActionController::RoutingError do
      get component_path(:non_existant_name)
    end
  end
end
