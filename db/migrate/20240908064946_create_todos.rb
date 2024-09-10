class CreateTodos < ActiveRecord::Migration[7.2]
  def change
    create_table :todos do |t|
      t.string :title, null: false
      t.datetime :completed_at, null: true

      t.timestamps
    end
  end
end
