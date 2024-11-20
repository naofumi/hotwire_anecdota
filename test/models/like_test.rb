require "test_helper"

class LikeTest < ActiveSupport::TestCase
  test "fixtures are valid" do
    like = likes(:one)
    assert like.valid?
  end

  test "fixture associated to likable" do
    like = likes(:one)
    assert_equal todos(:liked_by_sazae), like.likable
  end

  test "fixture associated to user" do
    like = likes(:one)
    assert_equal users(:sazae), like.user
  end

  test "duplicate likes are invalid" do
    todo = todos(:liked_by_sazae)
    duplicate_todo = todo.likes.build(user: users(:sazae))

    assert duplicate_todo.invalid?
  end
end
