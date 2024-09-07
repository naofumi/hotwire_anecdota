class CreateHotels < ActiveRecord::Migration[7.2]
  def change
    create_table :hotels do |t|
      t.string :name
      t.string :prefecture
      t.string :city
      t.string :tagline
      t.text :description

      t.timestamps
    end
  end
end
