class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable
  has_many :earned_badges
  has_many :user_game_data
  has_one_attached :profile_photo
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  def average_time
    user_data = user_game_data
    if user_data.present?
      average_time = user_data.sum(:time_taken).to_f / 60 / user_data.count
      my_time = Time.at(average_time)
      formatted_time = my_time.strftime("%M:%S")
      return formatted_time
    else
      return 0
    end
  end
end
