json.extract! file_node, :id, :name, :directory, :created_at, :updated_at
json.url file_node_url(file_node, format: :json)
