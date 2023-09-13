class CreateUserGameData < ActiveRecord::Migration[7.0]
  def change
    create_table :user_game_data do |t|
      t.references :room, null: false, foreign_key: true
      t.integer :time_taken
      t.boolean :finish
      t.boolean :bonus_finish
      t.references :user, null: false, foreign_key: true
      t.integer :game_xp

      t.timestamps
    end
  end
end
