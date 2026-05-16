require "test_helper"

class MembershipTest < ActiveSupport::TestCase
  test "fixtures are valid" do
    namihei = memberships(:namihei)
    assert namihei.valid?

    sazae = memberships(:sazae)
    assert sazae.valid?
  end

  test "enum predicates" do
    namihei = memberships(:namihei)
    assert namihei.membership_type_company?
    assert_not namihei.membership_type_personal?
  end

  test "validates presence of name" do
    namihei = memberships(:namihei)
    namihei.name = nil
    assert namihei.invalid?
  end

  test "validates presence of email" do
    namihei = memberships(:namihei)
    namihei.email = nil
    assert namihei.invalid?
  end

  test "validates uniqueness of email" do
    sazae_email = memberships(:sazae).email
    namihei = memberships(:namihei)
    namihei.email = sazae_email

    assert namihei.invalid?
  end

  test "validates presence of membership_type" do
    namihei = memberships(:namihei)
    namihei.membership_type = nil
    assert namihei.invalid?
  end

  test "validates correctness of membership_type" do
    namihei = memberships(:namihei)
    namihei.membership_type = :hoge
    assert namihei.invalid?
  end
end
