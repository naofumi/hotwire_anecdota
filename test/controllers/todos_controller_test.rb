require "test_helper"

class TodosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @todo = todos(:liked_by_sazae)
  end

  test "should get index" do
    get todos_url
    assert_response :success
  end

  test "should create todo" do
    with_variant(:streams) do
      assert_difference("Todo.count") do
        post todos_url, params: { todo: { completed_at: @todo.completed_at, title: @todo.title } },
                        headers: { accept: "text/vnd.turbo-stream.html" }
      end
    end

    assert_response :success
  end

  test "should get edit" do
    get edit_todo_url(@todo)
    assert_response :success
  end

  test "should update todo" do
    patch todo_url(@todo), params: { todo: { completed_at: @todo.completed_at, title: @todo.title } },
                           headers: { accept: "text/vnd.turbo-stream.html" }
    assert_turbo_stream action: :replace, count: 2
  end

  test "should destroy todo" do
    assert_difference("Todo.count", -1) do
      delete todo_url(@todo)
    end

    assert_redirected_to todos_url
  end
end
