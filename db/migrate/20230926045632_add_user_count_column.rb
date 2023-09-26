class AddUserCountColumn < ActiveRecord::Migration[7.0]
  def change
    add_column :rooms, :user_count, :integer
  end
end
