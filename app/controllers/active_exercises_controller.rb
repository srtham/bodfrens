require 'json'

class ActiveExercisesController < ApplicationController

  def update
    @active_exercise = ActiveExercise.find(params[:active_exercise_id])
    @user_game_datum = @active_exercise.user_game_datum
    @active_exercise.complete = params[:complete]
    data = { id: @active_exercise.id, complete: @active_exercise.complete, xp: @active_exercise.exercise.exercise_xp }
    if @active_exercise.save
      MultiplayerChannel.broadcast_to(
        @active_exercise.user_game_datum.room,
        data.to_json
      )
      head :ok
    end
    # Count the number of active_exercises where complete is true and bonus is true
    finished_bonus_exercises_count = @user_game_datum.active_exercises.joins(:exercise)
                                                     .where(complete: true,
                                                            exercises: { is_bonus: true }).count

    # Count the number of active_exercises where complete is true and bonus is false
    finished_regular_exercises_count = @user_game_datum.active_exercises.joins(:exercise)
                                                       .where(complete: true,
                                                              exercises: { is_bonus: false }).count

    regular_complete_data = { user_id: @user_game_datum.user_id,
                              user_game_data_id: @user_game_datum.id,
                              regular_finish: true }

    bonus_complete_data = { user_id: @user_game_datum.user_id,
                            user_game_data_id: @user_game_datum.id,
                            bonus_finish: true }

    if finished_regular_exercises_count == 5 && @user_game_datum.room.bonus == false
      # Broadcast a certain message
      MultiplayerChannel.broadcast_to(
        @active_exercise.user_game_datum.room,
        regular_complete_data.to_json
      )
      head :ok
    elsif finished_bonus_exercises_count == 3
      # Broadcast a different message
      MultiplayerChannel.broadcast_to(
        @active_exercise.user_game_datum.room,
        bonus_complete_data.to_json
      )
      head :ok
    end

  end
end
