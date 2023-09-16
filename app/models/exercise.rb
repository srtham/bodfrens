class Exercise < ApplicationRecord
  has_many :active_exercises, dependent: :destroy
  has_many :users, through: :active_exercises
  has_many :users, through: :user_game_datum
  has_many :badges, through: :earned_badges
  has_many :rooms, through: :user_game_data
end
