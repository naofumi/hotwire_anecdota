require "test_helper"

class SitepressPagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @hotel = hotels(:manareaserina)
  end

  test "should get top page" do
    get "/directory"
    assert_response :success

    assert_select "h1", text: /コンテンツ一覧/
  end

  test "public URLs use the configured site origin" do
    get "/introduction/about_this_site", headers: { "Host" => "example.test" }

    assert_response :success
    assert_select "link[rel=canonical][href='https://frontend.naofumi.dev/introduction/about_this_site']", count: 1
    assert_select "meta[property='og:url'][content='https://frontend.naofumi.dev/introduction/about_this_site']",
                  count: 1
  end

  test "get /examples/store/store-server-state should display whole breadcrumbs" do
    get "/examples/store/store-server-state"

    assert_select "nav[aria-label=Breadcrumb] li:nth-child(1)", text: "Home"
    assert_select "nav[aria-label=Breadcrumb] li:nth-child(2)", text: "コード例"
    assert_select "nav[aria-label=Breadcrumb] li:nth-child(3)", text: "Apple Store模写（複雑なステート）"
    assert_select "nav[aria-label=Breadcrumb] li:nth-child(4)", text: "ステートをサーバに持たせる"
  end
end
