class UserGameDataController < ApplicationController
  # skip_before_action :verify_authenticity_token, only: %i[update]
  def update
    # JSON.parse(request.body.read)
    # Access specific data fields (assuming you sent data like { "field1": "value1", "field2": "value2" })
    game_xp = params[:game_xp]
    finish = params[:finish]
    time_taken = params[:time_taken]
    user_game_datum = UserGameDatum.find(params[:id])
    user_game_datum.game_xp = game_xp
    user_game_datum.finish = finish
    user_game_datum.time_taken = time_taken
    user_game_datum.bonus_finish = params[:bonus_finish]
    user_game_datum.save
  end

  def show
    @game_room_id = Room.find(params[:id])
    @user_game_data = @game_room_id.user_game_data.first # may get more complicated with more users
  end

  def show_game_stats
    @game_room_id = Room.find(params[:id])
    @user_game_data = @game_room_id.user_game_data.first # may get more complicated with more users
    @user_level = show_game_stats_user
    raise
  end

  def show_game_stats_user
    @user = @user_game_data.user
    @user_xp = @user.user_game_data.sum(:game_xp)
    raise
    @user_level = User.calculate_level(@user_xp_earned)
  end
end
