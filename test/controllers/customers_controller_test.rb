require "test_helper"

class CustomersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @customer = customers(:ikura)
  end

  test "should get index" do
    get customers_url
    assert_response :success
    assert body.include?(customers(:ikura).name)
    assert body.include?(customers(:sazae).name)
  end

  test "should get index with query params" do
    get customers_url(query: "aza")
    assert_response :success
    assert_not body.include?(customers(:ikura).name)
    assert body.include?(customers(:sazae).name)
  end

  test "should get edit" do
    get edit_customer_url(@customer)
    assert_response :success
  end

  test "should update customer" do
    patch customer_url(@customer), params: { customer: { jp_name: @customer.jp_name, name: "new name" } }

    assert_redirected_to customers_url
    @customer.reload
    assert "new name", @customer.name
  end
end
