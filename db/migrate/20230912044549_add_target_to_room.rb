class AddTargetToRoom < ActiveRecord::Migration[7.0]
  def change
    add_column :rooms, :target, :datetime
  end
end
