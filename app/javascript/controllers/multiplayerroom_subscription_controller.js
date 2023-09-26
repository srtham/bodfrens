import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

// Connects to data-controller="multiplayerroom-subscription"
export default class extends Controller {
  static values = { multiplayerroomId: Number }
  static targets = [ "messages" ]

  connect() {
    this.channel = createConsumer().subscriptions.create(
      { channel: "MultiplayerroomChannel", multiplayerroom_id: this.multiplayerroomIdValue },
      {
        received: (data) => {
          this.messagesTarget.insertAdjacentHTML("beforeend", data)
        },
      }
    )
    console.log("Connected to multiplayerroom subscription controller!")
  }
}
