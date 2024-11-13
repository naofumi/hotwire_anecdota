require "test_helper"

class SitepressPagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @hotel = hotels(:halekulani)
  end

  class TopPage < self
    test "should get top page" do
      get root_url
      assert_response :success
      assert_select "h2", "Anecdotes on Hotwire"
    end
  end

  class SectionPages < self
    test "should get /introduction/what_is_hotwired" do
      get "/introduction/what_is_hotwire"
      assert_response :success
      assert_select "h1", "Hotwireとは何か？"
    end

    test "breadcrumbs should be Home/概要/Hotwireとは何か？" do
        get "/introduction/what_is_hotwire"
        assert_select "nav[aria-label=Breadcrumb] li:nth-child(1)", text: "Home"
        assert_select "nav[aria-label=Breadcrumb] li:nth-child(2)", text: "概要"
        assert_select "nav[aria-label=Breadcrumb] li:nth-child(3)", text: "Hotwireとは何か？"
    end

    class SectionChildPages < self
      test "breadcrumbs should represent whole path" do
        get "/examples/store/store-server-state"

        assert_select "nav[aria-label=Breadcrumb] li:nth-child(1)", text: "Home"
        assert_select "nav[aria-label=Breadcrumb] li:nth-child(2)", text: "コード例"
        assert_select "nav[aria-label=Breadcrumb] li:nth-child(3)", text: "製品選択画面のステート"
        assert_select "nav[aria-label=Breadcrumb] li:nth-child(4)", text: "製品選択画面のステートをサーバに持たせた例"
      end
    end
  end
end
