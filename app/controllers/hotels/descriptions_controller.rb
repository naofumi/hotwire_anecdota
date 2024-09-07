class Hotels::DescriptionsController < HotelBaseController
  before_action :set_hotel
  def show
  end

  private

    def set_hotel
      @hotel = Hotel.find(params[:hotel_id])
    end
end
