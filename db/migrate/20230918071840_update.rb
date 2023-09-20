class Update < ActiveRecord::Migration[7.0]
  def change
    add_column :rooms, :bonus, :boolean, default: false
  end
end
