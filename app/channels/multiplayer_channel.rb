class MultiplayerChannel < ApplicationCable::Channel
  before_subscribe :set_room

  def subscribed
    @room = Room.find_by(id: params[:multiplayerroom_id])
    puts "multiplayerroom_id: #{params[:multiplayerroom_id]}"
    Rails.logger.info "Received params: #{params.inspect}"
    return reject unless @room

    stream_for @room
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def relay(data)
    return reject unless @room

    Rails.logger.info "Relaying message: #{data['message']}"
    MultiplayerChannel.broadcast_to(@room, message: data["message"])
  end

  def receive(data)
    case data["message"]
    when "Click button"
      ActionCable.server.broadcast "multiplayer_channel", message: "Click button", button_id: data["button_id"]
    when "Regular exercise completed by client!"
      # Handle regular exercise completion
    when "Bonus exercise completed by client!"
      # Handle bonus exercise completion
    end
  end

  private

  def set_room
    @room = Room.find_by(id: params[:multiplayerroom_id])
  end
end
