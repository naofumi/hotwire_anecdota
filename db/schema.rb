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

ActiveRecord::Schema[8.1].define(version: 2026_05_05_020536) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activities", force: :cascade do |t|
    t.string "after"
    t.string "before"
    t.datetime "created_at", null: false
    t.string "event"
    t.integer "trackable_id", null: false
    t.string "trackable_type", null: false
    t.datetime "updated_at", null: false
    t.index ["trackable_type", "trackable_id"], name: "index_activities_on_trackable"
  end

  create_table "buckets", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.integer "position", null: false
    t.datetime "updated_at", null: false
  end

  create_table "customers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "jp_name", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "features", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", null: false
    t.string "description"
    t.integer "hotel_id", null: false
    t.string "image_path"
    t.integer "position"
    t.string "tagline"
    t.datetime "updated_at", null: false
    t.index ["hotel_id"], name: "index_features_on_hotel_id"
  end

  create_table "file_nodes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "directory"
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "hotels", force: :cascade do |t|
    t.string "city"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "name"
    t.string "prefecture"
    t.string "tagline"
    t.datetime "updated_at", null: false
  end

  create_table "likes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "likable_id", null: false
    t.string "likable_type", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["likable_type", "likable_id"], name: "index_likes_on_likable"
    t.index ["user_id", "likable_type", "likable_id"], name: "index_likes_on_user_and_likable", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "memberships", force: :cascade do |t|
    t.string "company_name"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "membership_type", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.date "valid_from", null: false
    t.date "valid_to", null: false
  end

  create_table "reservations", force: :cascade do |t|
    t.date "check_in", null: false
    t.date "check_out", null: false
    t.datetime "created_at", null: false
    t.string "guest_name", null: false
    t.string "guest_phone", null: false
    t.string "requested_room_id", null: false
    t.datetime "updated_at", null: false
  end

  create_table "room_nights", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date", null: false
    t.integer "reservation_id", null: false
    t.integer "room_id", null: false
    t.datetime "updated_at", null: false
    t.index ["date"], name: "index_room_nights_on_date"
    t.index ["reservation_id"], name: "index_room_nights_on_reservation_id"
    t.index ["room_id", "date"], name: "index_room_nights_on_room_id_and_date", unique: true
    t.index ["room_id"], name: "index_room_nights_on_room_id"
  end

  create_table "rooms", force: :cascade do |t|
    t.string "category", null: false
    t.datetime "created_at", null: false
    t.string "number", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tasks", force: :cascade do |t|
    t.integer "bucket_id", null: false
    t.datetime "created_at", null: false
    t.datetime "deadline"
    t.text "description"
    t.string "name", null: false
    t.integer "position", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["bucket_id"], name: "index_tasks_on_bucket_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "todos", force: :cascade do |t|
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_profiles", force: :cascade do |t|
    t.integer "age"
    t.datetime "created_at", null: false
    t.string "name"
    t.string "name_jp"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_user_profiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.datetime "updated_at", null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "features", "hotels"
  add_foreign_key "likes", "users"
  add_foreign_key "room_nights", "reservations"
  add_foreign_key "room_nights", "rooms"
  add_foreign_key "tasks", "buckets"
  add_foreign_key "tasks", "users"
  add_foreign_key "user_profiles", "users"
end
