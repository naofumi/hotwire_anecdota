class Todos::LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_todo
  def create
    if params[:like]
      @todo.like_by! current_user
    else
      @todo.unlike_by! current_user
    end

    if request.variant.mpa?
      return redirect_to todos_path
    end
  end

  private

    def set_todo
      @todo = Todo.find(params[:todo_id])
    end
end
