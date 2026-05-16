class CreateMemberships < ActiveRecord::Migration[8.1]
  def change
    create_table :memberships do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.date :valid_from, null: false
      t.date :valid_to, null: false
      t.string :membership_type, null: false
      t.string :company_name

      t.timestamps
    end
  end
end
