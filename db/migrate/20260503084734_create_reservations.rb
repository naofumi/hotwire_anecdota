class CreateReservations < ActiveRecord::Migration[8.1]
  def change
    create_table :reservations do |t|
      t.string :guest_name, null: false
      t.string :guest_phone, null: false
      t.references :requested_room, null: false, foreign_key: { to_table: :rooms }
      t.date :check_in, null: false
      t.date :check_out, null: false

      t.timestamps
    end
  end
end
