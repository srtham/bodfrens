require 'json'

class ActiveExercisesController < ApplicationController

  def update
    @active_exercise = ActiveExercise.find(params[:active_exercise_id])
    @user_game_data = @active_exercise.user_game_datum
    @active_exercise.complete = params[:complete]
    data = { id: @active_exercise.id, complete: @active_exercise.complete, xp: @active_exercise.exercise.exercise_xp }
    if @active_exercise.save
      MultiplayerChannel.broadcast_to(
        @active_exercise.user_game_datum.room,
        data.to_json
      )
      head :ok
    end

    return unless @user_game_data.active_exercises.where(complete: true).count == 5

    user_complete_data = { user_id: @user_game_data.user_id,
                           user_game_data_id: @user_game_data.id,
                           regular_finish: true }
    MultiplayerChannel.broadcast_to(
      @active_exercise.user_game_datum.room,
      user_complete_data.to_json
    )
    head :ok
  end
end
