class BoardsController < ApplicationController
  def show
    @tasks = Task.all.order(:position)
    @buckets = Bucket.all.order(:position)
  end
end
