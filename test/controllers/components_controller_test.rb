require "test_helper"

class ComponentsControllerTest < ActionDispatch::IntegrationTest
  class IndexTest < ComponentsControllerTest
    test "success" do
      get components_path

      assert_response :success
    end
  end

  class ShowTest < ComponentsControllerTest
    test ":toggle returns success" do
      get component_path(:toggle)

      assert_response :success
    end
  end
end
