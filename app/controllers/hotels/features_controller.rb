class Hotels::FeaturesController < HotelBaseController
  before_action :set_hotel
  def index
    @features = @hotel.topic_features.order(:position)
  end

  def room
    @features = @hotel.room_features.order(:position)
  end

  private

    def set_hotel
      @hotel = Hotel.find(params[:hotel_id])
    end
end
