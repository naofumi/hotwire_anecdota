json.extract! task, :id, :name, :description, :position, :deadline, :bucket_id, :created_at, :updated_at
json.url task_url(task, format: :json)
