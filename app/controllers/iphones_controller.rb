class IphonesController < ApplicationController
  layout "iphone"
  before_action :set_iphone
  def show
  end

  def create
    @iphone.model = params[:model] if params[:model]
    @iphone.color = params[:color] if params[:color]
    redirect_to iphone_path
  end

  private

    def set_iphone
      session[:iphone] ||= {}
      @iphone = Iphone.new(session[:iphone])
    end
end
