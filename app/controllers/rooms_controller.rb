class RoomsController < ApplicationController
  def create
    @room = Room.new(room_params)
    @room.user = current_user
  end

  def show
    @room = Room.find(params[:id])
    @user_game_data = UserGameDatum.find(user: current_user, room: @room)
    @active_exercise = ActiveExercise.find(user_game_datum: @user_game_data)
  end

  # POST
  def single_player
    # 1. create room
    room = Room.create(mode: "single")
    # 2. create user game data
    game_data = UserGameDatum.create(user: current_user, room:)
    # 3. create active exercise
    Exercise.default.sample(5).each do |exercise|
      ActiveExercise.create(exercise:, user_game_datum: game_data)
    end

    redirect_to room_path(@room)
  end

  private

  def set_room
    @room = Room.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def room_params
    params.require(:room).permit(:winner_user_id, :user_game_data_id, :active_exercise_id, :exercise_id, :user_id, :room_id)
  end
end
