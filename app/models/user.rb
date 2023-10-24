class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2]
  has_many :earned_badges
  has_many :user_game_data
  has_one_attached :profile_photo

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  def self.from_omniauth(auth)
    where(uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.avatar_url = auth.info.image
      # if you use confirmable and the providers(s) you use validate emails,
      # uncomment the line below to skip the confrimation emails.
      # user.skip_confirmation!
    end
  end

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
