import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="how-it-works"
export default class extends Controller {
  connect() {
    console.log("The how it works controller is connected.")
    this.modal = document.querySelector(".how-it-works-screen")
  }

  openHowItWorksModal(e) {
    e.preventDefault();
    this.modal.style = "display:flex"
  }

  closeHowItWorksModal(e) {
    this.modal = document.querySelector(".how-it-works-screen")
    e.preventDefault();
    this.modal.style = "display:none"
  }
}
