import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

// Connects to data-controller="lobby-subscribe"
export default class extends Controller {
  static values = { roomId: Number }
  static targets = ["linkPage", "startPage", "startGameButton"]

  connect() {
    this.channel = createConsumer().subscriptions.create(
      { channel: "LobbyChannel", id: this.roomIdValue },
      { received: data => {
        console.log(data)
        if (data === 2) {
          //remove the link page when there are 2 players in the room
          this.linkPageTarget.classList.add("lobby-page-container-hidden")
          this.linkPageTarget.classList.remove("lobby-page-container")
          // show the start page
          this.startPageTarget.classList.add("lobby-page-container")
          this.startPageTarget.classList.remove("lobby-page-container-hidden")
        }
        if (data === "ready") {
          console.log(data)
          window.location.href = `/room/${this.roomIdValue}`;
        }
       }
      }
    )
    console.log(`Subscribed to the lobby with the id ${this.roomIdValue}.`)
  }

  wait(e) {
    e.currentTarget.classList.remove("main-orange-btn")
    e.currentTarget.classList.add("h1-lobby")
    e.currentTarget.innerText="Waiting for bodfren...";
    e.currentTarget.disabled = true;
    // this.startGameButtonTarget.disabled = true;
    e.currentTarget.parentElement.submit();
  }

  disconnect() {
    console.log("Unsubscribed from the chatroom")
    this.channel.unsubscribe()
  }

}
