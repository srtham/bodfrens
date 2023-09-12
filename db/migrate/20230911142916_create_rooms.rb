class CreateRooms < ActiveRecord::Migration[7.0]
  def change
    create_table :rooms do |t|
      t.boolean :single_or_multi
      t.integer :winner_user_id

      t.timestamps
    end
  end
end
