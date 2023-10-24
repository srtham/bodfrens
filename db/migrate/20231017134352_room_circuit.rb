class RoomCircuit < ActiveRecord::Migration[7.0]
  def change
    add_column :rooms, :circuit, :boolean
  end
end
