require "test_helper"

class Todos::LikesControllerTest
  class DescribeCreate
    class WhenLikeParamsIsSetAndUserHasNotLikedTodo < ActionDispatch::IntegrationTest
      setup do
        @like_param = "1"
        @todo = todos(:liked_by_sazae)
        @current_user = users(:namihei)
      end

      test "should create like on todo and redirect" do
        with_variant :mpa do
          assert_difference -> { Like.count }, 1 do
            login_user @current_user do
              post todo_likes_path(@todo, like: @like_param, format: :turbo_stream)
            end
          end

          assert_response :found
        end
      end
    end
  end
end
