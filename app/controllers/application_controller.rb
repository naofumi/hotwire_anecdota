class ApplicationController < ActionController::Base
  include Variantable
  before_action :set_current_variant, unless: -> { _1.is_a? Sitepress::SiteController }

  helper_method :current_user

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern

  private

    def authenticate_user!
      # Use the first user until we implement authentication
      Current.user = User.first
    end

    def current_user
      @current_user ||= Current.user
    end

    def set_current_variant
      request.variant = validated_variant(session[:variant])
    end
end
