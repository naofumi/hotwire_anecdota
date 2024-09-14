class CreateFileNodes < ActiveRecord::Migration[7.2]
  def change
    create_table :file_nodes do |t|
      t.string :name
      t.string :directory

      t.timestamps
    end
  end
end
