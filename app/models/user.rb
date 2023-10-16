class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2]
  has_many :earned_badges
  has_many :user_game_data
  has_one_attached :profile_photo

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  def average_time
    user_data = user_game_data
    if user_data.present?
      average_time = user_data.sum(:time_taken).to_f / user_data.count
      minutes = average_time / 60
      seconds = average_time % 60
      formatted_time = "#{minutes.to_i.to_s.rjust(2, '0')}:#{seconds.to_i.to_s.rjust(2, '0')}"
      return formatted_time
    else
      return 0
    end
  end
end
