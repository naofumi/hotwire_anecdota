json.extract! reservation, :id, :guest_name, :guest_phone, :check_in, :check_out, :created_at, :updated_at
json.url reservation_url(reservation, format: :json)
