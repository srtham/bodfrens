import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="game"
export default class extends Controller {
  static targets = ["button", "bar", "timer", "xp", "bonus", "mainRoom", "bonusRoom", "bonusButton"];

  static values = {
    secondsUntilEnd: Number,
    end: Number,
    room: Number,
    user: Number,
    dataId: Number,
    secondsLeft: Number,
    xp: Number
  }

  connect() {
    this.XPvalue = this.xpValue; // XP Value tracks how much the XP user has gathered so far in a game room.
    this.csrfToken = document.querySelector("meta[name='csrf-token']").content
    // bunch of logs to check if the data being sent is correct...
    console.log(`this is the user_id connected to the room = ${this.userValue}`)
    console.log(`this is the ID of the user_game_data = ${this.dataIdValue}`)
    console.log(`this is the room ID = ${this.roomValue}`);
    console.log(`this is the end value= ${this.endValue}`);
    console.log("The game is now connected");
    console.log(`This is the XP value of the room = ${this.xpValue}` )

    // timer settings:
    ///// this.secondsUntilEnd = this.data.get("seconds-until-end-value");
    this.roomTotalTime = this.secondsUntilEnd


    this.secondsUntilEnd = this.secondsLeftValue
    console.log(this.secondsUntilEnd); // to check the data value after each interval

    this.countdown = setInterval(this.countdown.bind(this), 1000) // sets the interval for countdown to reload every 1 second

    //set values for the bar calculations
    this.barEndNumber = this.endValue - this.xpValue
    this.barWidth = 0

    // Modal controls
    this.Modal = document.getElementById("bonusPromptModal");
  }

  markComplete(e) {
    e.preventDefault()

    this.XPvalue = this.XPvalue + parseInt(e.currentTarget.value,10);
    console.log(`the XP value is = ${this.XPvalue}`)

    // Changing the colors of the buttons depending on their value (negative or positive)
    if (e.currentTarget.value > 0) {
      e.currentTarget.style = "background-color: orange; margin: 5px; width: 200px";
    } else {
      e.currentTarget.style = "background-color: blue; margin: 5px; width: 200px ";
    }

    // Increasing the width of the bar
    this.barWidth += parseInt(e.currentTarget.value,10);
    this.barTarget.style.width = `${(this.barWidth / this.barEndNumber) * 100}%`
    console.log(this.barWidth)

    // Change the value of the button to negative
    e.currentTarget.value = e.currentTarget.value * -1

    // End Game with Finish
    if (this.XPvalue == this.endValue) {
      this.updateUserGameDatumWithFinish();
      console.log("REGULAR GAME FINISH");
      this.showBonusModal();
    };
  }

  changeBarWidth() {

  }


  countdown() {

    if (this.secondsUntilEnd <= 0) {
      console.log("Time's up!!!")
      clearInterval(this.countdown); // guard clause - this should call the modal
      this.timerTarget.innerHTML = "Time's Up!";
      return
    }

    const minutesLeft = Math.floor(this.secondsUntilEnd / 60)
    const secondsLeft = Math.floor(this.secondsUntilEnd % 60).toString().padStart(2, '0')

    this.timerTarget.innerHTML = `${minutesLeft} : ${secondsLeft}`

    this.secondsUntilEnd = this.secondsUntilEnd - 1;

  }

  updateUserGameDatumWithFinish() {
  // Update the data to the ruby controller
    fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": this.csrfToken
      },
      body: JSON.stringify({game_xp: this.XPvalue, finish: true, time_taken: this.roomTotalTime - this.secondsUntilEnd, user_game_datum_id: this.dataIdValue})
    });
  }


  updateUserGameDatumWithQuit(e) {
    // Update the data to the ruby controller
      e.preventDefault()
      fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({game_xp: this.XPvalue - 100, finish: false, time_taken: 900 - this.secondsUntilEnd, user_game_datum_id: this.dataIdValue})
      });
      window.location.href = `/room/${this.roomValue}/game_complete`;
    }

  showBonusModal() {
    // Currently it shows buttons but it needs to show modals
    console.log(this.Modal)
    this.Modal.classList.remove("hidden-modal");
    this.Modal.classList.add("game-modal");
  }

  changeRoomToBonus() {
    // Update the data to the ruby controller
      fetch(`/room/${this.roomValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({bonus: true})
      });
    }


  markBonusComplete(e) {
    e.preventDefault()

    this.XPvalue = this.XPvalue + parseInt(e.currentTarget.value,10);
    console.log(`the XP value is = ${this.XPvalue}`)

    // Changing the colors of the buttons depending on their value (negative or positive)
    if (e.currentTarget.value > 0) {
      e.currentTarget.style = "background-color: orange; margin: 5px; width: 200px";
    } else {
      e.currentTarget.style = "background-color: blue; margin: 5px; width: 200px ";
    }

    // Increasing the width of the bar
    this.barWidth += parseInt(e.currentTarget.value,10);
    this.barTarget.style.width = `${(this.barWidth / this.barEndNumber) * 100}%`
    console.log(this.barWidth)

    // Change the value of the button to negative
    e.currentTarget.value = e.currentTarget.value * -1

    // End Game with Finish
    if (this.XPvalue == this.endValue) {
      this.updateUserGameDatumWithFinish();
      console.log("Bonus GAME FINISH");
      window.location.href = `/room/${this.roomValue}/game_complete`;
    };
  }


  startBonus() {
    this.changeRoomToBonus();
    location.reload();
  }

}
