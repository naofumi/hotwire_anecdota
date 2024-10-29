class Todos::LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_todo
  def create
    sleep 1
    @todo.like! current_user

    redirect_to todos_url
  end

  def destroy
    sleep 1
    @todo.unlike! current_user

    redirect_to todos_url
  end

  private

    def set_todo
      @todo = Todo.find(params[:todo_id])
    end
end
