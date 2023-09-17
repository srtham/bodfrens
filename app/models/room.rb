class Room < ApplicationRecord
  has_many :user_game_data, dependent: :destroy
  has_many :user, through: :user_game_data
  has_many :exercises, through: :active_exercises, dependent: :destroy

  validates :mode, presence: true, inclusion: { in: %w[single multi] }
end
