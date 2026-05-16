module Reservations
  class TablesController < ApplicationController
    def show
      @from = params[:from] ? Date.parse(params[:from]) : Date.today
      @to = @from + 1.week
      @room_nights_by_room_id_and_date =
        RoomNight.room_nights_by_room_id_and_date(from: @from, to: @to)
    end
  end
end
