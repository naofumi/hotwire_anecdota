json.extract! user, :id, :name, :email, :created_at, :updated_at
json.userProfile do
  json.extract! user.user_profile, :name
end
