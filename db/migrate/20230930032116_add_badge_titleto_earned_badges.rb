class AddBadgeTitletoEarnedBadges < ActiveRecord::Migration[7.0]
  def change
    add_column :earned_badges, :badge_title, :string
  end
end
