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
    @user_game_data = @game_room_id.user_game_data.find { |instance| instance.user == current_user }
  end

  def show_game_stats
    @game_room_id = Room.find(params[:id])
    @user = current_user
    @user_game_data = @game_room_id.user_game_data.find { |instance| instance.user == current_user }
    @user_game_time = game_time(@user_game_data.time_taken)
    @user_xp_earned_total = @user.user_game_data.sum(:game_xp)
    @user_xp_earned_game = @user_game_data.game_xp
    @user_start_level = show_user_start_level
    @user_level = show_user_level
    @xp_left_to_next_level = xp_to_next_level(@user_xp_earned_total, @user_level)
    @xp_progress_percentage = xp_progress_percentage(@user_xp_earned_total)
    # @user_start_badge = show_user_start_badge
    # @user_badge = show_user_badge
    # @new_badge_count = @user_badge - @user_start_badge
  end

  private

  def game_time(user_time)
    my_time = Time.at(user_time)
    return my_time.strftime("%M:%S")
  end

  def xp_to_next_level(user_xp_earned, user_level)
    base_xp_increment = 200
    total_xp_of_reach_next_level = user_level * base_xp_increment
    total_xp_of_reach_next_level - user_xp_earned
  end

  def xp_progress_percentage(user_xp_earned)
    base_xp_increment = 200
    user_level = (user_xp_earned / base_xp_increment).to_i
    xp_to_next_level = (user_level + 1) * base_xp_increment
    xp_needed_for_next_level = xp_to_next_level - user_xp_earned
    ((base_xp_increment - xp_needed_for_next_level).to_f / base_xp_increment * 100).round(2)
  end

  def show_user_start_level
    user_start_xp = @user_xp_earned_total - @user_xp_earned_game
    (user_start_xp.to_i / 200) + 1
  end

  def show_user_level
    (@user_xp_earned_total.to_i / 200) + 1
  end

  def show_user_start_badge
  end

  def show_user_badge
  end
end
