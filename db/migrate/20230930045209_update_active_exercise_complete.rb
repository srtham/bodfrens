class UpdateActiveExerciseComplete < ActiveRecord::Migration[7.0]
  def change
    change_column :active_exercises, :complete, :boolean, default: false
  end
end
