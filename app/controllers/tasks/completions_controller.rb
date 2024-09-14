class Tasks::CompletionsController < ApplicationController
  before_action :set_task

  def create
    @task.complete!

    render turbo_stream: turbo_stream.turbo_stream_refresh_tag(request_id: nil)
  end

  def destroy
    @task.uncomplete!

    render turbo_stream: turbo_stream.turbo_stream_refresh_tag(request_id: nil)
  end

  private

    def set_task
      @task = Task.find(params[:task_id])
    end
end
