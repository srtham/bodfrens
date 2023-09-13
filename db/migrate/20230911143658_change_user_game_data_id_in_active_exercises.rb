class ChangeUserGameDataIdInActiveExercises < ActiveRecord::Migration[7.0]
  def change
    # Remove the old column
    remove_column :active_exercises, :user_game_data_id, :integer

    # Add the new column as a foreign key reference
    add_reference :active_exercises, :user_game_data, foreign_key: true
  end
end
