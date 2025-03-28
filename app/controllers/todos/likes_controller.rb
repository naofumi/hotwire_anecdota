class Todos::LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_todo
  set_available_variants :mpa, :streams, :optimistic

  def create
    sleep 1 unless Rails.env.test?

    if params[:like]
      @todo.like_by! current_user
    else
      @todo.unlike_by! current_user
    end

    if request.variant.mpa?
      redirect_to todos_path
    end
  end

  private

    def set_todo
      @todo = Todo.find(params[:todo_id])
    end
end
