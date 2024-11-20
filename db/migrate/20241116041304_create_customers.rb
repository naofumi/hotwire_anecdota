class CreateCustomers < ActiveRecord::Migration[7.2]
  def change
    create_table :customers do |t|
      t.string :name, null: false
      t.string :jp_name, null: false

      t.timestamps
    end
  end
end
