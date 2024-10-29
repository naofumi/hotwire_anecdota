class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  private
    def authenticate_user!
      # Use the first user until we implement authentication
      Current.user = User.first
    end

    def current_user
      @current_user ||= Current.user
    end
end
