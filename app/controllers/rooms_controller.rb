class RoomsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[update]

  def create
    @room = Room.new(room_params)
    @room.user = current_user
  end

  # def update_room
  #   end_game = params[:end_game]
  #   game_xp = params[:game_xp]
  #   finish = params[:finish]
  #   time_taken = params[:time_taken]
  #   user_game_datum = UserGameDatum.find(params[:user_game_datum_id])
  #   user_game_datum.game_xp = game_xp
  #   user_game_datum.finish = finish
  #   user_game_datum.time_taken = time_taken
  #   user_game_datum.save
  # end

  def update
    bonus = params[:bonus]
    room = Room.find(params[:id])
    room.bonus = bonus
    room.save
  end

  def show
    @room = Room.find(params[:id])
    @user_game_data = UserGameDatum.find_by(user: current_user, room: @room)
    @user = @user_game_data.user_id

    @regular_exercises = @user_game_data.exercises.where(is_bonus: false)
    @regular_xp = calculate_exp(@regular_exercises)
    @bonus_exercises = @user_game_data.exercises.where(is_bonus: true)
    @bonus_xp = calculate_exp(@bonus_exercises)
    # @multiplayerroom = Multiplayerroom.find_by(room: @room)
    # @message = Message.new

    if @room.mode == "multi"
      render "rooms/multiplayershow"
    else
      render "rooms/show"
    end
  end

  def calculate_exp(exercises)
    ## To calculate the separate XP points for the bonus room and the regular room.
    final_xp = 0
    exercises.each do |exercise|
      final_xp += exercise.exercise_xp
    end
    return final_xp
  end

  # POST
  def single_player
    # 1. create room
    room = Room.create(mode: "single")
    # 2. create user game data
    game_data = UserGameDatum.create(user: current_user, room:)
    # 3. Get 5 non-bonus exercises from the database
    regular_exercises = Exercise.where(is_bonus: false).limit(5)
    # 4. Get 3 bonus exercises from the database
    bonus_exercises = Exercise.where(is_bonus: true).limit(3)
    # 5. Create active exercises linked to the user_game_data of the room.
    create_active_exercises(regular_exercises, game_data)
    create_active_exercises(bonus_exercises, game_data)
    redirect_to room_path(room)
  end

  def multi_player
    # 1. create room
    room = Room.create(mode: "multi")
    room.save!
    # 2. create user game data
    game_data = UserGameDatum.create(user: current_user, room:)
    # 3. Get 5 non-bonus exercises from the database
    regular_exercises = Exercise.where(is_bonus: false).limit(5)
    # 4. Get 3 bonus exercises from the database
    bonus_exercises = Exercise.where(is_bonus: true).limit(3)
    # 5. Create active exercises linked to the user_game_data of the room.
    create_active_exercises(regular_exercises, game_data)
    create_active_exercises(bonus_exercises, game_data)
    redirect_to room_path(room)
  end

  def create_active_exercises(exercises, game_data)
    exercises.each do |exercise|
      ActiveExercise.create(exercise:, user_game_datum: game_data)
    end
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
