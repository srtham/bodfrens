class MultiplayerChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    multiplayerroom = Multiplayerroom.find(params[:multiplayerroom_id])

    stream_for multiplayerroom
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def relay(data)
    multiplayerroom = Multiplayerroom.find(params[:multiplayerroom_id])
    MultiplayerChannel.broadcast_to(multiplayerroom, message: data["message"])
    # ActionCable.server.broadcast("multiplayer_channel", message: data["message"])
  end
end
