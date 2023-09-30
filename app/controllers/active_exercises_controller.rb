require 'json'

class ActiveExercisesController < ApplicationController

  def update
    @active_exercise = ActiveExercise.find(params[:active_exercise_id])
    status = params[:complete]
    @active_exercise.complete = status
    data = { id: @active_exercise.id, complete: @active_exercise.complete, xp: @active_exercise.exercise.exercise_xp }
    if @active_exercise.save
      MultiplayerChannel.broadcast_to(
        @active_exercise.user_game_datum.room,
        data.to_json
      )
      head :ok
    end
  end

end
