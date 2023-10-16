class UserGameDataCanAcceptNullUserId < ActiveRecord::Migration[7.0]
  def change
    change_column_null :user_game_data, :user_id, true
  end
end
