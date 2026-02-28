class IphonesController < ApplicationController
  layout "iphone"
  before_action :set_iphone
  before_action :set_catalog
  def show
  end

  def create
    @iphone.model = params[:model].presence
    @iphone.color = params[:color].presence
    @iphone.ram = params[:ram].presence

    respond_to do |format|
      format.turbo_stream
    end
  end

  def destroy
    session.delete(:iphone)

    redirect_to iphone_path
  end

  private

    def set_catalog
      @catalog = Iphone::Catalog.new
    end

    def set_iphone
      session[:iphone] ||= {}
      @iphone = Iphone.new(session[:iphone])
    end
end
