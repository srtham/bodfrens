class CreateExercises < ActiveRecord::Migration[7.0]
  def change
    create_table :exercises do |t|
      t.string :title
      t.string :description
      t.integer :exercise_xp
      t.boolean :is_bonus

      t.timestamps
    end
  end
end
