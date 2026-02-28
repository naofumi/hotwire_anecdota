class AddUniqueIndexToLikesForUserAndLikable < ActiveRecord::Migration[7.2]
  def change
    add_index :likes,
              [ :user_id, :likable_type, :likable_id ],
              unique: true,
              name: "index_likes_on_user_and_likable",
              if_not_exists: true
  end
end
