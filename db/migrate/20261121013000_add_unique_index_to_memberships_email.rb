class AddUniqueIndexToMembershipsEmail < ActiveRecord::Migration[8.1]
  def change
    add_index :memberships, :email, unique: true
  end
end
