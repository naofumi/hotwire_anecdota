module Reservations
  class TablesController < ApplicationController
    def show
      # Date.today follows the process zone. Time.zone is Tokyo, so Time.zone.today
      # would shift this default week whenever the process zone is not Tokyo.
      @from = params[:from] ? Date.parse(params[:from]) : Date.today # rubocop:disable Rails/Date
      @to = @from + 1.week
      @room_nights_by_room_id_and_date =
        RoomNight.room_nights_by_room_id_and_date(from: @from, to: @to)
    end
  end
end
