class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable
  has_many :earned_badges
  has_many :user_game_data
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  def average_time
    user_data = user_game_data
    if user_data.present?
      average_time = user_data.sum(:time_taken).to_f / user_data.count
      minutes = (average_time / 60).to_i
      seconds = (average_time % 60).to_i
      return "#{minutes}:#{seconds}"
    else
      return 0
    end
  end
end
