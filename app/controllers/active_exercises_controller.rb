class ActiveExercisesController < ApplicationController

  def update
    @active_exercise = ActiveExercise.find(params[:active_exercise_id])
    status = params[:complete]
    @active_exercise.complete = status
    if @active_exercise.save
      MultiplayerChannel.broadcast_to(
        @active_exercise.user_game_datum.room,
        "Exercise completed for user"
      )
      head :ok
    end
  end

end
