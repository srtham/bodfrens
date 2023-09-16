import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="game"
export default class extends Controller {
  static targets = ["button", "bar", "timer", "xp"];

  static values = {
    secondsUntilEnd: Number,
    end: String
  }

  connect() {
    this.XPvalue = 0
    console.log("The game is now connected");

    console.log(this.xpTarget);

    console.log(`this is the XP= ${this.endValue}`)
    // timer settings:

    // this.secondsUntilEnd = this.data.get("seconds-until-end-value");
    this.secondsUntilEnd = 900
    console.log(this.secondsUntilEnd); // to check the data value after each interval

    this.countdown = setInterval(this.countdown.bind(this), 1000) // sets the interval for countdown to reload every 1 second
  }

  markComplete(e) {
    e.preventDefault()
    // so make this currentTarget, then you don't have...

    this.XPvalue = this.XPvalue + parseInt(e.currentTarget.value,10);

    if (e.currentTarget.value > 0) {
      e.currentTarget.style = "background-color: orange; margin: 5px; width: 200px";
    } else {
      e.currentTarget.style = "background-color: blue; margin: 5px; width: 200px ";
    }

    // // Have to edit the bar width to be a percentage
    // this.barTarget.style.width = `${this.XPvalue}%`;
    this.barTarget.style.width = `${(this.XPvalue / this.endValue) * 100}%`
    e.currentTarget.value = e.currentTarget.value * -1
    console.log(e.currentTarget.value)
    console.log(`the XP value is = ${this.XPvalue}`)



    if (this.XPvalue == this.endValue) {
      console.log("GAME FINISH")
    }


  }


  countdown() {

    if (this.secondsUntilEnd <= 0) {
      clearInterval(this.countdown); // guard clause - this should call the modal
      this.timerTarget.innerHTML = "Time's Up!";
      return
    }

    const minutesLeft = Math.floor(this.secondsUntilEnd / 60)
    const secondsLeft = Math.floor(this.secondsUntilEnd % 60).toString().padStart(2, '0')

    this.timerTarget.innerHTML = `${minutesLeft} : ${secondsLeft}`

    this.secondsUntilEnd = this.secondsUntilEnd - 1;

  }

}
