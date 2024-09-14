Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  root "components#index"

  resources :components, only: [ :index, :show ]
  resources :file_nodes do
    get :details, on: :member
  end
  resources :hotels do
    resources :features, module: :hotels do
      collection do
        get :room
        get :restaurant
        get :service
        get :basic_info
      end
    end
  end
  resource :iphone
  resources :todos
  resources :features
end
