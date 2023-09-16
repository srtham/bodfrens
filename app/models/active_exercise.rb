class ActiveExercise < ApplicationRecord
  belongs_to :exercise
  belongs_to :user_game_datum
end
