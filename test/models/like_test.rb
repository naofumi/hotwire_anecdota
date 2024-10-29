require "test_helper"

class LikeTest < ActiveSupport::TestCase
  test "fixtures are valid" do
    like = likes(:one)
    assert like.valid?
  end

  test "fixture associated to likable" do
    like = likes(:one)
    assert_equal todos(:one), like.likable
  end

  test "fixture associated to user" do
    like = likes(:one)
    assert_equal users(:one), like.user
  end

  test "duplicate likes are invalid" do
    todo = todos(:one)
    duplicate_todo = todo.likes.build(user: users(:one))

    assert duplicate_todo.invalid?
  end
end
