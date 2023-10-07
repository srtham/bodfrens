class BadgesController < ApplicationController
  def index
    @badges = Badge.all
    @earned_friend_supporter = friend_supporter
    @earned_lone_wolf = lone_wolf
    @earned_first_game = first_game
    @earned_bonus_bunny = bonus_bunny
    @earned_quitter = quitter
  end

  private

  def friend_supporter
    @user = current_user
    multi_games_won = @user.user_game_data.joins(:room).where(room: { mode: 'multi' }).count
    multi_games_won >= 1
  end

  def lone_wolf
    @user = current_user
    single_games_finished = @user.user_game_data.joins(:room).where(room: { mode: 'single' }, finish: true).count
    single_games_finished >= 3
  end

  def first_game
    @user = current_user
    workout_finished = @user.user_game_data.where(finish: true).count
    workout_finished >= 1
  end

  def bonus_bunny
    @user = current_user
    bonus_games_finished = @user.user_game_data.where(bonus_finish: true).count
    bonus_games_finished >= 3
  end

  def quitter
    @user = current_user
    workout_not_finished = @user.user_game_data.where(finish: false).count
    workout_not_finished >= 1
  end
end
