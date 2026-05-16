class RoomNight < ApplicationRecord
  belongs_to :room
  belongs_to :reservation

  validates :date, uniqueness: { scope: :room }

  default_scope { order(date: :asc) }

  # Return RoomNights in the following format
  #     {
  #       [room_id_1]: {
  #         [date_1_1]: RoomNight_1_1,
  #         [date_1_2]: RoomNight_1_2,
  #         [date_1_3]: RoomNight_1_3,
  #         ...
  #       },
  #       [room_id_2]: {
  #         [date_2_1]: RoomNight_2_1,
  #         [date_2_2]: RoomNight_2_2,
  #         [date_2_3]: RoomNight_2_3,
  #         ...
  #       },
  #       ...
  #     }
  def self.room_nights_by_room_id_and_date(from:, to:)
    RoomNight.where(date: from..to)
             .each_with_object({}) do |room_night, memo|
      memo[room_night.room_id] ||= {}
      memo[room_night.room_id][room_night.date] = room_night
    end
  end
end
