class BoardsController < ApplicationController
  def show
    @tasks = Task.order(:position)
    @buckets = Bucket.order(:position)
  end
end
