class ChangeSingleMultiColumnForRooms < ActiveRecord::Migration[7.0]
  def change
    remove_column :rooms, :single_or_multi, :boolean
    add_column :rooms, :mode, :string

    remove_reference :active_exercises, :user_game_data
    add_reference :active_exercises, :user_game_datum, foreign_key: true
  end
end
