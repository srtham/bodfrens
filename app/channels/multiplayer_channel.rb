class MultiplayerChannel < ApplicationCable::Channel
  def subscribed
    multiplayerroom = Room.find(params[:id])
    stream_for multiplayerroom
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
