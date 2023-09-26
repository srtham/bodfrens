class UserCountAddDefault < ActiveRecord::Migration[7.0]
  def change
    change_column :rooms, :user_count, :integer, default: 0
  end
end
