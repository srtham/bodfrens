import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

// Connects to data-controller="multiplayerroom-subscription"
export default class extends Controller {
    static values = { roomId: Number }
    static targets = ["messages"]

    connect() {
      this.channel = createConsumer().subscriptions.create(
        { channel: "MultiplayerChannel", id: this.roomIdValue },
        { received: data => console.log(data) }
      )
      console.log(`Subscribed to the multiplayerroom with the id ${this.roomIdValue}.`)
    }
  }
