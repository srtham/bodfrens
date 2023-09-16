class Badge < ApplicationRecord
  has_many :earned_badges, dependent: :destroy
end
