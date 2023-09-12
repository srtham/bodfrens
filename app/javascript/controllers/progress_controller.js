import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="progress"
export default class extends Controller {
  connect() {
    console.log("the progress bar is connected.")
  }
}
