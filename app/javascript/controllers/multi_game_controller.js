import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multi-game"
export default class extends Controller {
  connect() {
    console.log("The game is now connected");
    this.csrfToken = document.querySelector("meta[name='csrf-token']").content
  }

  static values = {

    room: Number

  }


  markComplete(e) {
    e.preventDefault()
    const buttonId = e.currentTarget.getAttribute("id");
    // Now buttonId contains the id attribute of the clicked button
    fetch(`/room/${this.roomValue}/active_exercises/${buttonId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": this.csrfToken
      },
      body: JSON.stringify({active_exercise_id: buttonId, complete: true})
    })
    e.currentTarget.classList.remove("xp")
    e.currentTarget.classList.add("button-regular-done")
  }
}
