class RoomsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[update]

  def create
    @room = Room.create(mode: "multi")
    redirect_to lobby_room_path(@room.id)
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
  def create_from_lobby
    @room = Room.find(params[:id])
    puts @room.user_game_data.count
    # get all the ids associated with the room
    user_game_data_ids = @room.user_game_data.pluck(:user_id)
    # will not create a new UserGameDatum if user_id is already associated with the room.
    # Or if there are already 2 users associated with the room.
    if user_game_data_ids.include?(current_user.id)
      redirect_to lobby_room_path(@room), notice: "You can't play a game with yourself."
      return
    end

    return if @room.user_game_data.count >= 2

    # if there is 0 UserGameDatum associated with the room
    UserGameDatum.create(user: current_user, room: @room)

    return unless @room.user_game_data.count == 2

    # 3. Get 5 non-bonus exercises from the database
    regular_exercises = Exercise.where(is_bonus: false).limit(5)
    # 4. Get 3 bonus exercises from the database
    bonus_exercises = Exercise.where(is_bonus: true).limit(3)
    # 5. Create active exercises linked to the user_game_data of the room.
    @room.user_game_data.each do |game_data|
      create_active_exercises(regular_exercises, game_data)
      create_active_exercises(bonus_exercises, game_data)
    end

    LobbyChannel.broadcast_to(@room, "ready")
    head :ok
  end

  def update
    if params[:bonus].nil?
      @room = Room.find(params[:id])
      MultiplayerChannel.broadcast_to(@room, "start bonus")
      head :ok
    else
      bonus = params[:bonus]
      room = Room.find(params[:id])
      room.bonus = bonus
      room.save
    end
  end

  def lobby
  if user_signed_in?
    @room = Room.find(params[:id])
  else
    session[:room_id] = params[:id]
    redirect_to new_user_session_path, notice: "You must be signed in to join a lobby."
  end
  end

  def show
    @room = Room.find(params[:id])
    if @room.mode == "single"
      @user_game_data = UserGameDatum.find_by(user: current_user, room: @room)
      @user = current_user
      @regular_exercises = @user_game_data.exercises.where(is_bonus: false)
      @regular_xp = calculate_exp(@regular_exercises)
      @bonus_exercises = @user_game_data.exercises.where(is_bonus: true)
      @bonus_xp = calculate_exp(@bonus_exercises)
      render "rooms/singleplayershow"
    else
      user_game_data_ids = @room.user_game_data.pluck(:user_id)
      remaining_user_id = user_game_data_ids.reject { |id| id == current_user.id }
      @player2_user_id = remaining_user_id.first
      @player1_user_game_data = UserGameDatum.find_by(user: current_user, room: @room)
      @player1 = @player1_user_game_data.user
      @player2 = User.find(@player2_user_id)
      @player2_user_game_data = UserGameDatum.find_by(user: @player2_user_id, room: @room)

      @player1_regular_exercises = @player1_user_game_data.active_exercises.joins(:exercise)
                                                          .where(exercises: { is_bonus: false })

      @player1_bonus_exercises = @player1_user_game_data.active_exercises.joins(:exercise)
                                                        .where(exercises: { is_bonus: true })

      @player2_regular_exercises = @player2_user_game_data.active_exercises.joins(:exercise)
                                                          .where(exercises: { is_bonus: false })

      @player2_bonus_exercises = @player2_user_game_data.active_exercises.joins(:exercise)
                                                        .where(exercises: { is_bonus: true })

      # calculate xp
      @player1_regular_xp = calculate_multiplayer_exp(@player1_regular_exercises)
      @player2_regular_xp = calculate_multiplayer_exp(@player2_regular_exercises)
      @player1_bonus_xp = calculate_multiplayer_exp(@player1_bonus_exercises)
      @player2_bonus_xp = calculate_multiplayer_exp(@player2_bonus_exercises)

      render "rooms/multiplayershow"
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

  def calculate_multiplayer_exp(exercises)
    final_xp = 0
    exercises.each do |exercise|
      exact_exercise = Exercise.find(exercise.exercise_id)
      final_xp += exact_exercise.exercise_xp
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
