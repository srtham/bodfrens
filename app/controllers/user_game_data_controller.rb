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
    @user_game_time = format_time(@user_game_data.time_taken)
    @user_xp_earned_total = @user.user_game_data.sum(:game_xp)
    @user_xp_earned_game = @user_game_data.game_xp
    @user_start_level = show_user_start_level

    @user_level = show_user_level # may get more complicated with more users
    @xp_left_to_next_level = xp_to_next_level(@user_xp_earned_total, @user_level)
    @xp_progress_percentage = xp_progress_percentage(@user_xp_earned_total)
    # @user_start_badge = show_user_start_badge
    # @user_badge = show_user_badge
    # @new_badge_count = @user_badge - @user_start_badge

    # badges logic
    @user = current_user
    @friend_beater_gained = check_friend_beater
    @lone_wolf_gained = check_lone_wolf
    @bonus_bunny_gained = check_bonus_bunny
    @first_game_gained = check_first_game
    @quitter_gained = check_quitter_badge
  end

  private

  # def game_time(user_game_time)
  #   my_time = Time.at(user_game_time)
  #   return my_time.strftime("%M:%S")
  # end

  def format_time(user_game_time)
    minutes = user_game_time / 60
    seconds = user_game_time % 60
    "#{minutes.to_i.to_s.rjust(2, '0')}:#{seconds.to_i.to_s.rjust(2, '0')}"
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

  # checking for earned badges logic
  def check_friend_beater
    beat_friend = @user.user_game_data.joins(:room).where(room: { mode: 'multi', winner_user_id: @user_id }).count
    badge_title = "Friend Beater"

    if beat_friend == 1
      badge = Badge.find_by(title: badge_title)
      unless EarnedBadge.exists?(user: current_user, badge: badge)
        EarnedBadge.create!(user: current_user, badge: badge)
      end
    end
  end

  def check_lone_wolf
    single_games = @user.user_game_data.joins(:room).where(room: { mode: 'single' }, finish: true).count
    badge_title = "Lone Wolf"

    if single_games == 3
      badge = Badge.find_by(title: badge_title)
      unless EarnedBadge.exists?(user: current_user, badge: badge)
        EarnedBadge.create!(user: current_user, badge: badge)
      end
    end
  end

  def check_bonus_bunny
    bonus_game = @user.user_game_data.where(bonus_finish: true).count
    badge_title = "Bonus Bunny"
    if bonus_game == 3
      badge = Badge.find_by(title: badge_title)
      unless EarnedBadge.exists?(user: current_user, badge: badge)
        EarnedBadge.create!(user: current_user, badge: badge)
      end
    end
  end

  def check_first_game
    first_game = @user.user_game_data.where(finish: [true, false]).count
    badge_title = "First Game"

    if first_game == 1
      badge = Badge.find_by(title: badge_title)
      unless EarnedBadge.exists?(user: current_user, badge: badge)
        EarnedBadge.create!(user: current_user, badge: badge)
      end
    end
  end

  def check_quitter_badge
    quit_game = @user.user_game_data.where(finish: false).count
    badge_title = "Quitter"

    if quit_game == 1
      badge = Badge.find_by(title: badge_title)
      unless EarnedBadge.exists?(user: current_user, badge: badge)
        EarnedBadge.create!(user: current_user, badge: badge)
      end
    end
  end
end
