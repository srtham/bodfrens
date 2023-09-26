import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

const consumer = createConsumer(); // Create a consumer instance

// Connects to data-controller="multiplayerroom-subscription"
export default class extends Controller {
  static values = { multiplayerroomId: Number }
  static targets = ["button", "bonusButton"]

  markComplete(event) {
    // Logic for marking as complete
    console.log("Exercise completed!");

    const channel = consumer.subscriptions.create({ channel: "MultiplayerChannel" }, {
        received(data) {
            console.log(data);
        }
    });

    channel.send({ message: "Regular exercise completed by client!" });
}


  markBonusComplete(event) {
    // Logic for marking as complete
    console.log("Bonus Exercise completed!");

    const channel = consumer.subscriptions.create({ channel: "MultiplayerChannel" }, {
      received(data) {
        console.log(data);
      }
    });

    channel.send({ message: "Bonus exercise completed by client!" });
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
