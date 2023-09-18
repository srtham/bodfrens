// import { Controller } from "@hotwired/stimulus"

// // Connects to data-controller="timer"
// export default class extends Controller {
//   static targets = ["timer"];

//   connect() {
//     // this.secondsUntilEnd = this.data.get("seconds-until-end-value");
//     this.secondsUntilEnd = 900
//     console.log(this.secondsUntilEnd); // to check the data value after each interval
//     console.log("The timer is connected");
//     this.countdown = setInterval(this.countdown.bind(this), 1000) // sets the interval for countdown to reload every 1 second
//   }

//   countdown() {

//     if (this.secondsUntilEnd <= 0) {
//       clearInterval(this.countdown); // guard clause - this should call the modal
//       this.countdownTarget.innerHTML = "Time's Up!";
//       return
//     }

//     const minutesLeft = Math.floor(this.secondsUntilEnd / 60)
//     const secondsLeft = Math.floor(this.secondsUntilEnd % 60).toString().padStart(2, '0')

//     this.timerTarget.innerHTML = `${minutesLeft} : ${secondsLeft}`

//     this.secondsUntilEnd = this.secondsUntilEnd - 1;

//   }
// }
