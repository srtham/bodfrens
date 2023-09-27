import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

const consumer = createConsumer(); // Create a consumer instance

// Connects to data-controller="multiplayerroom-subscription"
export default class extends Controller {
  static values = { multiplayerroomId: Number }
  static targets = ["button", "bonusButton"]

  connect() {
    console.log("Connecting to multiplayerroom subscription controller!");
    this.channel = consumer.subscriptions.create(
      { channel: "MultiplayerChannel", multiplayerroom_id: this.multiplayerroomIdValue },
      {
        received: (data) => {
          console.log(data);

          if (data.message === "Regular exercise completed by client!") {
              // Find the regular button you want to "click" programmatically
              const regularButtonToClick = this.buttonTarget;
              if (regularButtonToClick) {
                  regularButtonToClick.click();
              }
          } else if (data.message === "Bonus exercise completed by client!") {
              // Find the bonus button you want to "click" programmatically
              const bonusButtonToClick = this.bonusButtonTarget;
              if (bonusButtonToClick) {
                  bonusButtonToClick.click();
              }
          }
        },
      }
    )
    console.log("Connected to multiplayerroom subscription controller!");
  }

  markComplete(event) {
    console.log("MP - Exercise completed!");
    this.channel.send({ message: "Regular exercise completed by client!" });
  }


  markBonusComplete(event) {
    console.log("MP - Bonus Exercise completed!");
    this.channel.send({ message: "Bonus exercise completed by client!" });
  }



  // connect() {
  //   this.channel = createConsumer().subscriptions.create(
  //     { channel: "MultiplayerChannel", multiplayerroom_id: this.multiplayerroomIdValue },
  //     {
  //       received: (data) => {
  //         this.messagesTarget.insertAdjacentHTML("beforeend", data)
  //       },
  //     }
  //   )
  //   console.log("Connected to multiplayerroom subscription controller!")
  // }
}
