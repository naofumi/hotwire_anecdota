json.extract! membership, :id, :name, :email, :membership_type, :company_name, :created_at, :updated_at
json.url membership_url(membership, format: :json)
