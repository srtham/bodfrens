class UserGameDatum < ApplicationRecord
  belongs_to :room
  belongs_to :user
  has_many :active_exercises, dependent: :destroy
end
