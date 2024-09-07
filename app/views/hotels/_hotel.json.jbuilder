json.extract! hotel, :id, :name, :prefecture, :city, :tagline, :description, :created_at, :updated_at
json.url hotel_url(hotel, format: :json)
