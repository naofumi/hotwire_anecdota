class Todos::LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_todo
  def create
    @todo.like!(current_user)

    render plain: "success"
  end

  def destroy
  end

  private

    def set_todo
      @todo = Todo.find(params[:todo_id])
    end
end
