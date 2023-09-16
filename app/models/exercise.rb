class Exercise < ApplicationRecord
  has_many :active_exercises, dependent: :destroy
  has_many :rooms, through: :user_game_data
  has_many :user_game_data, through: :active_exercises

  scope :default, -> { where(is_bonus: false) }
end
