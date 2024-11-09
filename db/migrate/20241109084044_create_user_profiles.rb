class CreateUserProfiles < ActiveRecord::Migration[7.2]
  def change
    create_table :user_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :name_jp
      t.integer :age

      t.timestamps
    end
  end
end
