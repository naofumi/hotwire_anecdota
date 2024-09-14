class CreateActivities < ActiveRecord::Migration[7.2]
  def change
    create_table :activities do |t|
      t.references :trackable, null: false, polymorphic: true
      t.string :event
      t.string :before
      t.string :after

      t.timestamps
    end
  end
end
