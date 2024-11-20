class TodosController < ApplicationController
  before_action :set_todo, only: %i[ edit update destroy ]
  before_action :authenticate_user!
  set_available_variants :mpa, :streams, :optimistic

  # GET /todos or /todos.json
  def index
    @todos = Todo.all
  end

  # GET /todos/1 or /todos/1.json
  # GET /todos/1/edit
  def edit
  end

  # POST /todos or /todos.json
  def create
    @todo = Todo.new(todo_params)

    respond_to do |format|
      if @todo.save
        flash.now.notice = "Todo was successfully created."
        format.turbo_stream
      else
        format.turbo_stream
      end
    end
  end

  # PATCH/PUT /todos/1 or /todos/1.json
  def update
    respond_to do |format|
      if @todo.update(todo_params)
        # format.html { redirect_to @todo }
        # flash.notice = "Todo was successfully updated."
        #
        # Note that request_id needs to be set to nil
        # format.turbo_stream { render turbo_stream: turbo_stream.refresh(request_id: nil) }
        flash.now.notice = "Todo was successfully updated."
        format.turbo_stream
      else
        # format.html { render :edit, status: :unprocessable_content }
        format.turbo_stream { render status: :unprocessable_content}
      end
    end
  end

  # DELETE /todos/1 or /todos/1.json
  def destroy
    @todo.destroy!

    respond_to do |format|
      flash.now.notice = "Todo was successfully destroyed."
      format.html { redirect_to todos_url, notice: "Todo was successfully destroyed." }
      format.turbo_stream
      format.json { head :no_content }
    end
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_todo
      @todo = Todo.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def todo_params
      params.require(:todo).permit(:title)
    end
end
