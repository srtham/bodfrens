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
    if (event.target.classList.contains('button-clicked')) {
      return;
    }

    event.target.classList.add('button-clicked');
    event.target.disabled = true;

    console.log("Exercise completed!")
    // event.target.classList.add('button-clicked');
    consumer.subscriptions.create({ channel: "MultiplayerChannel" }, {
      received(data) {
        console.log(data)
      }
    })
  }

  markBonusComplete(event) {
    // Logic for marking as complete
    // Send message to subscribed channel
    if (event.target.classList.contains('button-clicked')) {
      return;
    }

    event.target.classList.add('button-clicked');
    event.target.disabled = true;

    console.log("Bonus Exercise completed!")
    // event.target.classList.add('button-clicked');
    consumer.subscriptions.create({ channel: "MultiplayerChannel" }, {
      received(data) {
        console.log(data)
      }
    })
  }

  connect() {
    this.channel = createConsumer().subscriptions.create(
      { channel: "MultiplayerChannel", multiplayerroom_id: this.multiplayerroomIdValue },
      {
        received: (data) => {
          this.messagesTarget.insertAdjacentHTML("beforeend", data)
        },
      }
    )
    console.log("Connected to multiplayerroom subscription controller!")
  }
}
