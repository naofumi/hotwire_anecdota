# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_11_16_041304) do
  create_table "activities", force: :cascade do |t|
    t.string "trackable_type", null: false
    t.integer "trackable_id", null: false
    t.string "event"
    t.string "before"
    t.string "after"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["trackable_type", "trackable_id"], name: "index_activities_on_trackable"
  end

  create_table "buckets", force: :cascade do |t|
    t.string "name", null: false
    t.integer "position", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "customers", force: :cascade do |t|
    t.string "name", null: false
    t.string "jp_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "features", force: :cascade do |t|
    t.string "tagline"
    t.string "description"
    t.string "category"
    t.string "image_path"
    t.integer "position"
    t.integer "hotel_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["hotel_id"], name: "index_features_on_hotel_id"
  end

  create_table "file_nodes", force: :cascade do |t|
    t.string "name"
    t.string "directory"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "hotels", force: :cascade do |t|
    t.string "name"
    t.string "prefecture"
    t.string "city"
    t.string "tagline"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "likes", force: :cascade do |t|
    t.string "likable_type", null: false
    t.integer "likable_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["likable_type", "likable_id"], name: "index_likes_on_likable"
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.integer "position", null: false
    t.datetime "deadline"
    t.integer "bucket_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bucket_id"], name: "index_tasks_on_bucket_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "todos", force: :cascade do |t|
    t.string "title", null: false
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_profiles", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "name"
    t.string "name_jp"
    t.integer "age"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_profiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "features", "hotels"
  add_foreign_key "likes", "users"
  add_foreign_key "tasks", "buckets"
  add_foreign_key "tasks", "users"
  add_foreign_key "user_profiles", "users"
end
