class UsersController < ApplicationController
  set_available_variants :frame, :stream, :react, :jquery, :sjr

  # GET /users or /users.json
  def index
    @users = User.all
  end
end
