class Users::UserProfilesController < ApplicationController
  before_action :set_user
  before_action :set_user_profile, only: [ :show ]
  set_available_variants :hotwire, :react, :jquery

  # GET /user_profiles/1 or /user_profiles/1.json
  def show
    @user_profile = @user.user_profile

    render layout: false
  end

  private
    def set_user
      @user = User.find(params[:user_id])
    end

    def set_user_profile
      @user_profile = @user.user_profile
    end
end
