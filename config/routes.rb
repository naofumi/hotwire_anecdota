Rails.application.routes.draw do
  # Defines the root path route ("/")
  # root "components#index"
  sitepress_pages
  sitepress_root
  resources :users, only: [ :index ] do
    resource :user_profile, module: :users, only: [ :show ]
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  resource :board
  resources :buckets
  resources :components, only: [ :index, :show ]
  resources :customers, only: [ :index, :edit, :update ]
  resources :file_nodes do
    get :details, on: :member
  end
  resources :fixtures, only: [ :create ]
  resources :hotels do
    resources :features, module: :hotels, only: [ :index ] do
      collection do
        get :room
        get :restaurant
        get :service
        get :basic_info
      end
    end
  end
  resource :iphone
  resources :react, only: [ :show ], constraints: { id: %r{[\w/]+} } do
    collection do
      get :iphone
    end
  end
  resources :tasks do
    scope module: :tasks do
      resource :completion
    end
  end
  resources :todos, only: [ :index, :edit, :create, :update, :destroy ] do
    resource :likes, only: [ :create ], module: :todos
  end
  resource :variants, only: [ :update ]
end
