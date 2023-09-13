import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="game-button"
export default class extends Controller {
  static targets = ["button", "button2", "button3", "button4", "button5", "bar"];

  connect() {
    this.XPvalue = 0
    console.log("The game button is now connected");

  }

  markComplete(e) {
    e.preventDefault()
    console.log(e.currentTarget.value) // so make this currentTarget, then you don't have to button 2 3 4 5 2038i4
    e.currentTarget.value = e.currentTarget.value * -1
    console.log(e.currentTarget.value)
    this.XPvalue = this.XPvalue + 20;
    this.buttonTarget.innerHTML = "Exercise Completed";
    this.buttonTarget.disabled = true;
    this.barTarget.style.width = `${this.XPvalue}%`;
  }

  markCompleteTwo() {
    this.XPvalue = this.XPvalue + 20
    this.button2Target.innerHTML = "Exercise Completed";
    this.button2Target.disabled = true;
    console.log(this.XPvalue);
    this.barTarget.style.width = `${this.XPvalue}%`;

  }

  markCompleteThree() {
    this.XPvalue = this.XPvalue + 20
    this.button3Target.innerHTML = "Exercise Completed";
    this.button3Target.disabled = true;
    console.log(this.XPvalue);
    this.barTarget.style.width = `${this.XPvalue}%`;

  }

  markCompleteFour() {
    this.XPvalue = this.XPvalue + 20
    this.button4Target.innerHTML = "Exercise Completed";
    this.button4Target.disabled = true;
    console.log(this.XPvalue);
    this.barTarget.style.width = `${this.XPvalue}%`;

  }

  markCompleteFive() {
    this.XPvalue = this.XPvalue + 20
    this.button5Target.innerHTML = "Exercise Completed";
    this.button5Target.disabled = true;
    console.log(this.XPvalue);
    this.barTarget.style.width = `${this.XPvalue}%`;
  }

}
