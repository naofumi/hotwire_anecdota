json.extract! customer, :id, :name, :jp_name, :created_at, :updated_at
json.url customer_url(customer, format: :json)
