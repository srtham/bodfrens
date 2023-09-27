class PagesController < ApplicationController
  def home
    if user_signed_in? == false
      redirect_to new_user_session_path
    else
      @user = current_user
      @workout_played = @user.user_game_data.where(finish: [true, false]).count
      @user_xp_earned = @user.user_game_data.sum(:game_xp)
      @user_level = calculate_level(@user_xp_earned)
    end
  end

  def mode_select
  end

  private

  def calculate_level(user_xp_earned)
    base_xp_increment = 200
    (user_xp_earned / base_xp_increment).to_i + 1
  end
end
