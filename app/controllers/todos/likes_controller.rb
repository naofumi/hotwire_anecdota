class Todos::LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_todo
  before_action :add_delay
  set_available_variants :drive, :streams, :optimistic

  def create
    if params[:like]
      @todo.like_by! current_user
    else
      @todo.unlike_by! current_user
    end

    if request.variant.drive?
      redirect_to todos_path
    end
  end

  private

    def add_delay
      sleep 0.3 unless Rails.env.test?
    end

    def set_todo
      @todo = Todo.find(params[:todo_id])
    end
end
