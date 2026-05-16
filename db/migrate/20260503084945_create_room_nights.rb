class CreateRoomNights < ActiveRecord::Migration[8.1]
  def change
    create_table :room_nights do |t|
      t.references :room, null: false, foreign_key: true
      t.references :reservation, null: false, foreign_key: true
      t.date :date, null: false, index: true

      t.timestamps
      t.index([:room_id, :date], unique: true)
    end
  end
end

