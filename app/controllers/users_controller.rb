class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
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
end
