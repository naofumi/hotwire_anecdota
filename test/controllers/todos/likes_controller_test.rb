require "test_helper"

class Todos::LikesControllerTest < ActionDispatch::IntegrationTest
  class DescribeCreate < self
    class WhenLikeParamsIsSet < self
      setup do
        @like_param = "1"
      end

      class WhenUserDoesNotHaveTodo < self
        setup do
          @todo = todos(:one)
          @current_user = users(:two)
        end

        test "should create todo" do
          assert_difference -> { Like.count }, 1 do
            login_user @current_user do
              post todo_likes_path(@todo, like: @like_param, format: :turbo_stream)
            end
          end
        end

        test "should return status 200" do
          login_user @current_user do
            post todo_likes_path(@todo, like: "1", format: :turbo_stream)
          end

          assert_response :ok
        end
      end

      class WhenUserDoesNotHasTodo < self
        setup do
          @todo = todos(:two)
          @current_user = users(:one)
        end

        test "should create todo" do
          assert_difference -> { Like.count }, 1 do
            login_user @current_user do
              post todo_likes_path(@todo, like: "1", format: :turbo_stream)
            end
          end
        end

        test "should return status 200" do
          login_user @current_user do
            post todo_likes_path(@todo, like: "1", format: :turbo_stream)
          end

          assert_response :ok
        end
      end
    end
  end
end
