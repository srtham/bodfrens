class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @user_xp_earned = 200
    # @user.user_game_data.sum(:game_xp)
    @user_level = calculate_level(@user_xp_earned)
    @xp_left_to_next_level = xp_to_next_level(@user_xp_earned, @user_level)
    @xp_progress_percentage = xp_progress_percentage(@user_xp_earned, @xp_left_to_next_level)
    @average_workout_time = @user.average_time
    @workout_finished = @user.user_game_data.where(finish: true).count
    @bonus_games_started = @user.user_game_data.where(bonus_finish: [true, false]).count
    @bonus_games_finished = @user.user_game_data.where(bonus_finish: true).count
    @single_games_played = @user.user_game_data.joins(:room).where(room: { mode: 'single' }).count
    @single_games_finished = @user.user_game_data.joins(:room).where(room: { mode: 'single' }, finish: true).count
    @single_games_quit = @user.user_game_data.joins(:room).where(room: { mode: 'single' }, finish: false).count
    @multi_games_won = @user.user_game_data.joins(:room).where(room: { mode: 'multi', winner_user_id: @user_id }).count
    @multi_games_lost = @user.user_game_data.joins(:room).where(room: { mode: 'multi' }).where.not(room: { winner_user_id: @user_id }).count
    @multi_games_quit = @user.user_game_data.joins(:room).where(room: { mode: 'multi', winner_user_id: @user_id }, finish: false).count
  end

  private

  def calculate_level(_user_xp_earned)
    base_xp_increment = 200
    (@user_xp_earned / base_xp_increment).to_i + 1
  end

  def xp_to_next_level(_user_xp_earned, user_level)
    base_xp_increment = 200
    user_level * base_xp_increment
  end

  def xp_progress_percentage(user_xp_earned, xp_left_to_next_level)
    (user_xp_earned.to_f / xp_left_to_next_level * 100).round(2)
  end
end
