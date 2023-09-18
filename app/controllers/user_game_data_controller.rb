class UserGameDataController < ApplicationController

  def update
    # JSON.parse(request.body.read)
    # Access specific data fields (assuming you sent data like { "field1": "value1", "field2": "value2" })
    game_xp = params[:game_xp]
    finish = params[:finish]
    time_taken = params[:time_taken]
    user_game_datum = UserGameDatum.find(params[:id])
    user_game_datum.game_xp = game_xp
    user_game_datum.finish = finish
    user_game_datum.time_taken = time_taken
    user_game_datum.save

    # this triggers a PATCH request instead of a get request, will need to troubleshoot this...
    # redirect_to show_game_stats_room_path(user_game_datum.room) if finish == false
  end

  def show_game_stats
  end

end
