Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  resources :rooms, only: [:show], path: 'room' do
    member do
      get 'lobby', to: 'rooms#lobby', as: 'lobby'
    end
  end
end
