require "test_helper"

class SitepressPagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @hotel = hotels(:manareaserina)
  end

  test "should get top page" do
    get root_url
    assert_response :success
    assert_select "h2", "Anecdotes on Hotwire"
  end

  test "get /introduction/what_is_hotwired should return success" do
    get "/introduction/what_is_hotwire"
    assert_response :success
    assert_select "h1", "Hotwireとは何か？"
  end

  test "get /introduction/what_is_hotwired should display breadcrumbs" do
    get "/introduction/what_is_hotwire"
    assert_select "nav[aria-label=Breadcrumb] li:nth-child(1)", text: "Home"
    assert_select "nav[aria-label=Breadcrumb] li:nth-child(2)", text: "概要"
    assert_select "nav[aria-label=Breadcrumb] li:nth-child(3)", text: "Hotwireとは何か？"
  end

  test "get /examples/store/store-server-state should display whole breadcrumbs" do
    get "/examples/store/store-server-state"

    assert_select "nav[aria-label=Breadcrumb] li:nth-child(1)", text: "Home"
    assert_select "nav[aria-label=Breadcrumb] li:nth-child(2)", text: "コード例"
    assert_select "nav[aria-label=Breadcrumb] li:nth-child(3)", text: "複雑なステート（ショップの例）"
    assert_select "nav[aria-label=Breadcrumb] li:nth-child(4)", text: "Hotwireでステートをサーバに持たせる"
  end
end
