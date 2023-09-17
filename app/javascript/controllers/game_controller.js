import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="game"
export default class extends Controller {
  static targets = ["button", "bar", "timer", "xp"];

  static values = {
    secondsUntilEnd: Number,
    end: Number,
    room: Number,
    user: Number,
    dataId: Number
  }

  connect() {
    this.XPvalue = 0; // Set the initial XP of the game as 0.
    const roomID = this.roomValue;

    // bunch of logs to check if the data being sent is correct...
    console.log(`this is the user_id connected to the room = ${this.userValue}`)
    console.log(`this is the ID of the user_game_data = ${this.dataIdValue}`)
    console.log(`this is the room value = ${this.roomValue}`);
    console.log(`this is the end value= ${this.endValue}`);
    console.log("The game is now connected");

    // timer settings:
    ///// this.secondsUntilEnd = this.data.get("seconds-until-end-value");

    this.secondsUntilEnd = 900
    console.log(this.secondsUntilEnd); // to check the data value after each interval

    this.countdown = setInterval(this.countdown.bind(this), 1000) // sets the interval for countdown to reload every 1 second
  }

  markComplete(e) {
    e.preventDefault()
    // so make this currentTarget, then you don't have...

    this.XPvalue = this.XPvalue + parseInt(e.currentTarget.value,10);

    // Changing the colors of the buttons depending on their value (negative or positive)
    if (e.currentTarget.value > 0) {
      e.currentTarget.style = "background-color: orange; margin: 5px; width: 200px";
    } else {
      e.currentTarget.style = "background-color: blue; margin: 5px; width: 200px ";
    }

    // // Have to edit the bar width to be a percentage
    // this.barTarget.style.width = `${this.XPvalue}%`;
    this.barTarget.style.width = `${(this.XPvalue / this.endValue) * 100}%`
    e.currentTarget.value = e.currentTarget.value * -1

    console.log(`the XP value is = ${this.XPvalue}`)



    if (this.XPvalue == this.endValue) {
      this.updateUserGameDatum()
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


  updateUserGameDatum() {

  // Update the data to the ruby controller

    fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": "gMgm4LzwgzljqC-LMIsA0P9yBZAVBk1yJy6qo-b57LhXaEXGWmSDQD1LbJ3s0nNaKykat4XUROtrjfCgne9dOw",
      },
      body: JSON.stringify({game_xp: this.XPvalue, finish: true, time_taken: 900 - this.secondsUntilEnd, user_game_datum_id: this.dataIdValue})
    });
  }

}
