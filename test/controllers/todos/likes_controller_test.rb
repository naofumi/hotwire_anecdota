require "test_helper"

class Todos::LikesControllerTest
  class AuthenticationTest < ActionDispatch::IntegrationTest
    # temporary until we implement an authentication system
    test "should set current_user to first User" do
      assert User.first, Todos::LikesController.new.send(:current_user)
    end
  end

  class TodoCreationTest < ActionDispatch::IntegrationTest
    setup do
      @like_param = "1"
      @todo = todos(:liked_by_sazae)
    end

    test "should create like on todo and redirect if current_user has not liked it yet" do
      @current_user = users(:namihei)
      with_variant :mpa do
        assert_difference -> { Like.count }, 1 do
          login_user @current_user do
            post todo_likes_path(@todo, like: @like_param, format: :turbo_stream)
          end
        end

        assert_response :found
      end
    end

    test "should not like on todo and raises RecordInvalid if current_user has already liked it" do
      @current_user = users(:sazae)
      with_variant :mpa do
        login_user @current_user do
          assert_no_difference -> { Like.count } do
            assert_raises ActiveRecord::RecordInvalid do
              post todo_likes_path(@todo, like: @like_param, format: :turbo_stream)
            end
          end
        end
      end
    end
  end

  class TodoDeletionTest < ActionDispatch::IntegrationTest
    setup do
      @like_param = nil
      @todo = todos(:liked_by_sazae)
    end

    test "should delete like on todo and redirect if current_user has previously liked i" do
      @current_user = users(:sazae)
      with_variant :mpa do
        assert_difference -> { Like.count }, -1 do
          login_user @current_user do
            post todo_likes_path(@todo, like: @like_param, format: :turbo_stream)
          end
        end

        assert_response :found
      end
    end

    test "should raises RecordNotFound if current_user has not liked it yet" do
      @current_user = users(:namihei)
      with_variant :mpa do
        login_user @current_user do
          assert_no_difference -> { Like.count } do
            assert_raises ActiveRecord::RecordNotFound do
              post todo_likes_path(@todo, like: @like_param, format: :turbo_stream)
            end
          end
        end
      end
    end
  end
end
