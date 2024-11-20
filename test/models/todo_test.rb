require "test_helper"

class TodoTest < ActiveSupport::TestCase
  test "fixture is valid" do
    todo = todos(:liked_by_sazae)

    assert todo.valid?
  end

  test "invalid if title is blank" do
    todo = todos(:liked_by_sazae)
    todo.title = ""

    assert todo.invalid?
    assert_includes todo.errors.full_messages, "Titleを入力してください"
  end


  test "like! succeeds if not present" do
    user = users(:sazae)
    todo = todos(:liked_by_namihei)

    assert_changes -> { todo.likes.count }, from: 1, to: 2 do
      todo.like_by!(user)
    end
  end

  test "like! fails if already present" do
    user = users(:sazae)
    todo = todos(:liked_by_sazae)

    assert_raises ActiveRecord::RecordInvalid,
                  "Validation failed: User has already been taken" do
      todo.like_by!(user)
    end
  end

  test "unlike! succeeds if present" do
    user = users(:sazae)
    todo = todos(:liked_by_sazae)

    assert_changes -> { todo.likes.count }, from: 1, to: 0 do
      todo.unlike_by!(user)
    end
  end

  test "unlike! fails if not present" do
    user = users(:sazae)
    todo = todos(:liked_by_namihei)

    assert_raises ActiveRecord::RecordNotFound do
      todo.unlike_by!(user)
    end
  end
end
