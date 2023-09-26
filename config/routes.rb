Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  get 'mode-select', to: 'pages#mode_select', as: 'mode_select_pages'
  post 'mode-select', to: 'rooms#create', as: 'mode_select_rooms'
  post 'mode-select', to: 'user_game_data#create', as: 'mode_select_user_game_data'
  post 'mode-select', to: 'active_exercises#create', as: 'mode_select_active_exercises'

  post "single_player", to: "rooms#single_player", as: "single_player"
  post "multi_player", to: "rooms#multi_player", as: "multi_player"

  get 'users/:id', to: 'users#show', as: 'user'
  resources :badges, only: [:index]
  resources :exercises, only: [:index]
  resources :rooms, only: %i[show update], path: 'room' do
    member do
      get 'lobby', to: 'rooms#lobby', as: 'lobby'
      post 'lobby', to: 'rooms#create_from_lobby', as: 'rooms_create_from_lobby'
      post 'lobby', to: 'user_game_data#create_from_lobby', as: 'user_game_data_create_from_lobby'
      post 'lobby', to: 'active_exercises#create_from_lobby', as: 'active_exercises_create_from_lobby'
      resources :user_game_data, only: [:update]
      resources :active_exercises, only: [:update]
      get 'game_stats', to: 'user_game_data#show_game_stats', as: 'show_game_stats'
      # get 'game_complete', on: :member, as: 'show_game_complete'
      get 'game_complete', to: 'user_game_data#show', as: 'show_game_complete'
      # patch 'game_complete', to: 'user_game_data#update_complete', as: 'update_game_complete'
    end
  end

  # ## added this in for the quit feature, might have to delete.
  # patch 'room/:id/game_complete', to: "rooms#update_room", as: "patch_game_complete"
end
