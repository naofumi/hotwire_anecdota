class IphonesController < ApplicationController
  layout "iphone"
  before_action :set_iphone
  def show
  end

  def create
    @iphone.model = params[:model] if params[:model]
    @iphone.color = params[:color] if params[:color]
    @iphone.ram = params[:ram] if params[:ram]

    respond_to do |format|
      format.turbo_stream
    end
  end

  private

    def set_iphone
      session[:iphone] ||= {}
      @iphone = Iphone.new(session[:iphone])
    end
end
