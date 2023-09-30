class EarnedBadge < ApplicationRecord
  belongs_to :badge
  belongs_to :user

  attr_accessor :badge_title
end
