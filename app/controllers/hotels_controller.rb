class HotelsController < HotelBaseController
  set_available_variants :stimulus_values, :zustand
  before_action :set_hotel, only: [ :show ]

  # GET /hotels or /hotels.json
  def index
    redirect_to Hotel.first
  end

  # GET /hotels/1 or /hotels/1.json
  def show
    @carousel_images = [ "10543662.webp", "11471947.webp", "11471976.webp", "11471978.webp" ]
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_hotel
      @hotel = Hotel.find(params[:id])
    end
end
