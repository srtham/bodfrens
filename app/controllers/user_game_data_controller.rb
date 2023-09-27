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
    @user_game_data = @game_room_id.user_game_data.first
    @user_earned_xp = @user_game_data.game_xp
    @user_start_level = show_user_start_level
    @user_level = show_user_level # may get more complicated with more users

    # badges logic
    @user = current_user
    @friend_beater_gained = @user.user_game_data.joins(:room).where(room: { mode: 'multi', winner_user_id: @user_id }).count == 1
    @lone_wolf_gained = @user.user_game_data.joins(:room).where(room: { mode: 'single' }, finish: true).count == 3
    @bonus_bunny_gained = @user.user_game_data.where(bonus_finish: true).count == 3
    @first_game_gained = @user.user_game_data.where(finish: [true, false]).count == 1
    @quitter_gained = @user.user_game_data.where(finish: false).count == 1
  end

  private

  def show_user_start_level
    @user = @user_game_data.user
    @user_start_xp = @user.user_game_data.sum(:game_xp) - @user_earned_xp
    @user_start_level = ((@user_start_xp.to_i)/200) + 1
  end

  def show_user_level
    @user = @user_game_data.user
    @user_xp = @user.user_game_data.sum(:game_xp)
    @user_level = ((@user_xp.to_i)/200) + 1
  end

end
