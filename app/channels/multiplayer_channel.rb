class MultiplayerChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    multiplayerroom = Multiplayerroom.find(params[:multiplayerroom_id])
    stream_for multiplayerroom
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
