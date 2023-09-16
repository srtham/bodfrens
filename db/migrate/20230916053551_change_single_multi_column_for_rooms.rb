class ChangeSingleMultiColumnForRooms < ActiveRecord::Migration[7.0]
  def change
    remove_column :rooms, :single_or_multi, :boolean
    add_column :rooms, :mode, :string
  end
end
