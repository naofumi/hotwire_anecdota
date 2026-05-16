class CreateRooms < ActiveRecord::Migration[8.1]
  def change
    create_table :rooms do |t|
      t.string :number, null: false
      t.string :category, null: false

      t.timestamps
    end
  end
end
