class CreateTasks < ActiveRecord::Migration[7.2]
  def change
    create_table :tasks do |t|
      t.string :name, null: false
      t.text :description
      t.integer :position, null: false
      t.datetime :deadline
      t.references :bucket, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
