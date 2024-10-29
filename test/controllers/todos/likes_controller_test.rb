require "test_helper"

class Todos::LikesControllerTest
  class DescribeCreate
    class WhenCreatable < ActionDispatch::IntegrationTest
      setup do
        @todo = todos(:one)
        @current_user = users(:two)
      end

      test "should create todo" do
        assert_difference -> { Like.count }, 1 do
          login_user @current_user do
            post todo_likes_path(@todo)
          end
        end
      end

      test "should return status 200" do
        login_user @current_user do
          post todo_likes_path(@todo)
        end

        assert_response :ok
        assert_equal "success", response.body
      end
    end

    class WhenNotCreatable < ActionDispatch::IntegrationTest
      setup do
        @todo = todos(:two)
        @current_user = users(:one)
      end

      test "should create todo" do
        assert_difference -> { Like.count }, 1 do
          login_user @current_user do
            post todo_likes_path(@todo)
          end
        end
      end

      test "should return status 200" do
        login_user @current_user do
          post todo_likes_path(@todo)
        end

        assert_response :ok
        assert_equal "success", response.body
      end
    end
  end
end
