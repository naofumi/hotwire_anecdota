require "test_helper"

class TodoTest < ActiveSupport::TestCase
  test "like! succeeds if not present" do
    user = users(:one)
    todo = todos(:two)

    assert_changes -> { todo.likes.count }, from: 1, to: 2 do
      todo.like!(user)
    end
  end

  test "like! fails if already present" do
    user = users(:one)
    todo = todos(:one)

    assert_raises ActiveRecord::RecordInvalid,
                  "Validation failed: User has already been taken" do
      todo.like!(user)
    end
  end

  test "unlike! succeeds if present" do
    user = users(:one)
    todo = todos(:one)

    assert_changes -> { todo.likes.count }, from: 1, to: 0 do
      todo.unlike!(user)
    end
  end

  test "unlike! fails if not present" do
    user = users(:one)
    todo = todos(:two)

    assert_raises ActiveRecord::RecordNotFound do
      todo.unlike!(user)
    end
  end
end
