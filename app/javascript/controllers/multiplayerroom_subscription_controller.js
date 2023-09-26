import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

const consumer = createConsumer(); // Create a consumer instance

// Connects to data-controller="multiplayerroom-subscription"
export default class extends Controller {
  static values = { multiplayerroomId: Number }
  static targets = ["button", "bonusButton"]

  markComplete(event) {
    // Logic for marking as complete
    // Send message to subscribed channel
    console.log("Exercise completed!")
    consumer.subscriptions.create({ channel: "MultiPlayerRoomChannel" }, {
      received(data) {
        console.log(data)
      }
    })
  }

  markBonusComplete(event) {
    // Logic for marking as complete
    // Send message to subscribed channel
    console.log("Bonus Exercise completed!")
    consumer.subscriptions.create({ channel: "MultiPlayerRoomChannel" }, {
      received(data) {
        console.log(data)
      }
    })
  }

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
