class MultiplayerChannel < ApplicationCable::Channel
  def subscribed
    multiplayerroom = Room.find(params[:id])
    stream_for multiplayerroom

    sleep(1.0)
    data = { connect: true }
    MultiplayerChannel.broadcast_to(
      Room.find(params[:id]),
      data.to_json
    )
  end

  def unsubscribed
    data = { disconnect: true }
    MultiplayerChannel.broadcast_to(
      Room.find(params[:id]),
      data.to_json
    )
  end
end
