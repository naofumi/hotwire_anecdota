class UsersController < ApplicationController
  set_available_variants :hotwire, :react, :jquery

  # GET /users or /users.json
  def index
    @users = User.all
  end
end
