class UserGameDataController < ApplicationController
  # skip_before_action :verify_authenticity_token, only: %i[update]
  def update
    # JSON.parse(request.body.read)
    # Access specific data fields (assuming you sent data like { "field1": "value1", "field2": "value2" })

    end_game = params[:end_game]
    game_xp = params[:game_xp]
    finish = params[:finish]
    time_taken = params[:time_taken]
    user_game_datum = UserGameDatum.find(params[:id])
    user_game_datum.game_xp = game_xp
    user_game_datum.finish = finish
    user_game_datum.time_taken = time_taken
    user_game_datum.save

    redirect_to show_game_complete_room_path(user_game_datum.room) if end_game == true
  end

  def update_complete
    # might need to delete this... I'm still confused about the re-directs.
  end

  def show_game_stats
  end

end
