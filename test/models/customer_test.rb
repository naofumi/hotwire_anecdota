require "test_helper"

class CustomerTest < ActiveSupport::TestCase
  test "fixture values are valid" do
    sazae = customers(:sazae)
    assert sazae.valid?
  end

  test "invalid without name" do
    sazae = customers(:sazae)
    sazae.name = nil
    assert sazae.invalid?
  end

  test "invalid without jp_name" do
    sazae = customers(:sazae)
    sazae.jp_name = nil
    assert sazae.invalid?
  end

  test "scope search for :name with lower case returns hits and removes non-hits" do
    sazae = customers(:sazae)
    namihei = customers(:namihei)
    results = Customer.search("sa")
    assert_includes(results, sazae)
    assert_not_includes(results, namihei)
  end

  test "scope search for :name with upper case returns hits and removes non-hits" do
    sazae = customers(:sazae)
    namihei = customers(:namihei)
    results = Customer.search("SA")
    assert_includes(results, sazae)
    assert_not_includes(results, namihei)
  end

  test "scope search for :jp_name returns hits and removes non-hits" do
    sazae = customers(:sazae)
    namihei = customers(:namihei)
    results = Customer.search("サザエ")
    assert_includes(results, sazae)
    assert_not_includes(results, namihei)
  end

  test "scope search for blank returns all" do
    sazae = customers(:sazae)
    namihei = customers(:namihei)
    results = Customer.search("")
    assert_includes(results, sazae)
    assert_includes(results, namihei)
  end
end
