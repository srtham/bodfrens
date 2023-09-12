import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="game-button"
export default class extends Controller {
  static targets = ["button"];

  connect() {
    console.log("The game button is connected");
  }

  markComplete() {
    this.buttonTarget.innerHTML = "Exercise Completed";
  }
}
