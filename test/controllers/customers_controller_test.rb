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

  test "should get new" do
    get new_customer_url
    assert_response :success
  end

  test "should create customer" do
    assert_difference("Customer.count") do
      post customers_url, params: { customer: { jp_name: @customer.jp_name, name: @customer.name } }
    end

    assert_redirected_to customer_url(Customer.last)
  end

  test "should show customer" do
    get customer_url(@customer)
    assert_response :success
  end

  test "should get edit" do
    get edit_customer_url(@customer)
    assert_response :success
  end

  test "should update customer" do
    patch customer_url(@customer), params: { customer: { jp_name: @customer.jp_name, name: @customer.name } }
    assert_redirected_to customer_url(@customer)
  end

  test "should destroy customer" do
    assert_difference("Customer.count", -1) do
      delete customer_url(@customer)
    end

    assert_redirected_to customers_url
  end
end
