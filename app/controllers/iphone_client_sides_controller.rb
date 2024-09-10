class IphoneClientSidesController < ApplicationController
  layout "iphone"
  before_action :set_iphone
  def show
  end

  private

    def set_iphone
      @iphone = IphoneClientSide.new
    end
end
