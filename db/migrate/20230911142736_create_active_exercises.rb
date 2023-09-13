class CreateActiveExercises < ActiveRecord::Migration[7.0]
  def change
    create_table :active_exercises do |t|
      t.references :exercise, null: false, foreign_key: true
      t.integer :user_game_data_id
      t.boolean :complete

      t.timestamps
    end
  end
end
