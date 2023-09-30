import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="copy-text"
export default class extends Controller {
  static targets = ["linkBtn"];
  connect() {
    console.log("The copy text controller is connected")
  }

  copyText(e) {
    e.preventDefault()
    navigator.clipboard.writeText(e.currentTarget.value)
    this.linkBtnTarget.innerText = "Link Copied!"

    setTimeout(() => {
      this.linkBtnTarget.innerText = "Copy Link";
    }, 2000);
  }
}
