class MultiplayerChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    multiplayerroom = Multiplayerroom.find(params[:multiplayerroom_id])
    stream_form multiplayerroom
    stream_for multiplayerroom
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def relay(data)
    ActionCable.server.broadcast("multiplayer_channel", message: data["message"])
  end
end
