class CreateBuckets < ActiveRecord::Migration[7.2]
  def change
    create_table :buckets do |t|
      t.string :name, null: false
      t.integer :position, null: false

      t.timestamps
    end
  end
end
