class AddRoomBonusCount < ActiveRecord::Migration[7.0]
  def change
    add_column :rooms, :bonus_count_multiplayer, :integer, default: 0
  end
end
