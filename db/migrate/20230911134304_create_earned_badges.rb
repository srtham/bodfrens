class CreateEarnedBadges < ActiveRecord::Migration[7.0]
  def change
    create_table :earned_badges do |t|
      t.references :badge, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
