class CreateFeatures < ActiveRecord::Migration[7.2]
  def change
    create_table :features do |t|
      t.string :tagline
      t.string :description
      t.string :category
      t.string :image_path
      t.integer :position
      t.references :hotel, null: false, foreign_key: true

      t.timestamps
    end
  end
end
