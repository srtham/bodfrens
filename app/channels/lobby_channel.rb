class LobbyChannel < ApplicationCable::Channel
  def subscribed
    room = Room.find(params[:id])
    # total_users = ActionCable.server.connections.length
    add_user_to_room(room)
    stream_for room
    sleep(1.0)
    # LobbyChannel.broadcast_to(room, current_user.id)
    broadcast_user_count(room)
  end

  def unsubscribed
    room = Room.find(params[:id])
    remove_user_from_room(room)
    broadcast_user_count(room)
  end

  def broadcast_user_count(room)
    LobbyChannel.broadcast_to(room, room.user_count)
  end
  # def count_users
  #   total_users = ActionCable.server.connections.length
  #   # You can broadcast or use this count as needed.
  #   broadcast_to room, total_users:
  #   LobbyChannel.broadcast_to(total_users)
  # end
  private

  def add_user_to_room(room)
    room.user_count += 1
    room.save
  end

  def remove_user_from_room(room)
    room.user_count -= 1
    room.save
  end
end
