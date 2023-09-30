import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

// Connects to data-controller="multiplayerroom-subscription"
export default class extends Controller {
    static values = {
      roomId: Number,
      secondsUntilEnd: Number,
      end: Number,
      user: Number,
      dataId: Number,
      activeexerciseId: Number,
      secondsLeft: Number,
      xp: Number,
      timeTaken: Number,
      bonus: Boolean }
    static targets = ["exercise", "button", "bar", "timer", "xp", "barExp", "barFinalExp", "bonusButton", "player1exercise", "player2exercise"]

    connect() {

    //create multiplayerroom_subscription_channel
    this.channel = createConsumer().subscriptions.create(
      { channel: "MultiplayerChannel", id: this.roomIdValue },
      { received: data => {
        const active_exercise = JSON.parse(data);
        console.log(data)
        this.update_active_exercise(active_exercise)
      } }
    )
    console.log(`Subscribed to the multiplayerroom with the id ${this.roomIdValue}.`)

    this.csrfToken = document.querySelector("meta[name='csrf-token']").content
    this.XPvalue = 32 // XP Value tracks how much the XP user has gathered so far in a game room.
    // bunch of logs to check if the data being sent is correct...
    console.log(`this is the user_id connected to the room = ${this.userValue}`)
    console.log(`this is the ID of the user_game_data = ${this.dataIdValue}`)
    console.log(`this is the room ID = ${this.roomIdValue}`);
    console.log(`this is the end value= ${this.endValue}`);
    console.log("The game is now connected");
    console.log(`This is the XP value of the room = ${this.xpValue}` )
    console.log(`This is the time taken from the other room = ${this.timeTakenValue}` )
    // timer settings:
    ///// this.secondsUntilEnd = this.data.get("seconds-until-end-value");
    this.Modal = document.getElementById("bonusPromptModal");

    this.secondsUntilEnd = this.secondsLeftValue
    console.log(this.secondsUntilEnd); // to check the data value after each interval

    // this.countdown = setInterval(this.countdown.bind(this), 1000) // sets the interval for countdown to reload every 1 second

    //set values for the bar calculations
    this.barEndNumber = this.endValue - this.xpValue
    this.barWidth = 0

    //set the final EXP printed at the bottom via innerHTML
    this.barFinalExpTarget.innerHTML = `/${this.barEndNumber} XP EARNED`
    }

    update_active_exercise(active_exercise) {
      // // this.buttonSound.play()
      // this.XPvalue = this.XPvalue + parseInt(e.currentTarget.value,10);
      // console.log(`the XP value is = ${this.XPvalue}`)

      //change the icon
      const activeExerciseElement = this.player1exerciseTarget.querySelector(`[id="${active_exercise.id}"]`);

      const activeExerciseOpponentElement = this.player2exerciseTarget.querySelector(`[id="${active_exercise.id}"]`);
      // Changing the colors of the buttons depending on their value (negative or positive)
      if (active_exercise.complete) {
        if (activeExerciseOpponentElement !== null ) {
        // console.log(activeExerciseOpponentElement);
        activeExerciseOpponentElement.classList.remove("opponent-button");
        activeExerciseOpponentElement.classList.add("opponent-button-gray");
        };
        if (activeExerciseElement !== null ) {
        // console.log(activeExerciseElement);
        const h5Element = activeExerciseElement.querySelector("h5")
        activeExerciseElement.classList.remove("button-user");
        activeExerciseElement.classList.add("button-user-selected");
        h5Element.innerHTML = "XP\ngained";
        };

        //Mark the XP as earned

      } else {
        if (activeExerciseOpponentElement !== null ) {
        // console.log(activeExerciseOpponentElement);
        activeExerciseOpponentElement.classList.add("opponent-button");
        activeExerciseOpponentElement.classList.remove("opponent-button-gray");
        };
        if (activeExerciseElement !== null ) {
        // console.log(activeExerciseElement);
        const h5Element = activeExerciseElement.querySelector("h5")
        activeExerciseElement.classList.add("button-user");
        activeExerciseElement.classList.remove("button-user-selected");
        h5Element.innerHTML = "XP\ngained";
        };
      }

      // Increasing the width of the bar
      // this.barWidth += parseInt(activeExerciseElement.value,10);
      // this.barTarget.style.width = `${(this.barWidth / this.barEndNumber) * 100}%`
      // console.log(this.barWidth)

      // // Update the exp value printed at the bottom
      // this.barExpTarget.innerHTML = `${this.barWidth}`

      // Change the value of the button to negative

      // BUGGY CODE FOR OPPONENTS
      // activeExerciseElement.value = activeExerciseElement.value * -1

      // End Game with Finish
      // if (this.XPvalue == this.endValue) {
      //   // this.finishSound.play()
      //   this.updateUserGameDatumWithFinish();
      //   console.log("REGULAR GAME FINISH");
      //   this.showBonusModal();
      // };
    }

    updateActiveExercise(e) {
      e.preventDefault()
      console.log(e.currentTarget)
      console.log(e.currentTarget.value)
      if (e.currentTarget.value > 0) {
        fetch(`/room/${this.roomIdValue}/active_exercises/${e.currentTarget.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.csrfToken
          },
          body: JSON.stringify({active_exercise_id: Number(e.currentTarget.id), complete:true})
        })
        .then(res => console.log(res));
      } else {
        fetch(`/room/${this.roomIdValue}/active_exercises/${e.currentTarget.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.csrfToken
          },
          body: JSON.stringify({active_exercise_id: Number(e.currentTarget.id), complete: false})
        })
        .then(res => console.log(res));
      }


      e.currentTarget.value = e.currentTarget.value * -1
    }

    // countdown() {
    //   // ends the countdown when the round is over.
    //   if (this.XPvalue == this.endValue) {
    //     clearInterval(this.countdown);
    //     this.timerTarget.innerHTML = "Round End"
    //     return
    //   }

    //   if (this.secondsUntilEnd <= 0) {
    //     clearInterval(this.countdown); // guard clause - this should call the modal
    //     this.timerTarget.innerHTML = "Time's Up!";
    //     if (this.bonusValue == true) {
    //       this.updateUserGameDatumWithBonusTimesUp();
    //     } else {
    //       this.updateUserGameDatumWithTimesUp()
    //     }
    //     return
    //   }

    //   const minutesLeft = Math.floor(this.secondsUntilEnd / 60)
    //   const secondsLeft = Math.floor(this.secondsUntilEnd % 60).toString().padStart(2, '0')

    //   this.timerTarget.innerHTML = `${minutesLeft} : ${secondsLeft}`
    //   this.secondsUntilEnd = this.secondsUntilEnd - 1;


    // }

    // markComplete(e) {
    //   e.preventDefault()
    //   this.buttonSound.play()
    //   this.XPvalue = this.XPvalue + parseInt(e.currentTarget.value,10);
    //   console.log(`the XP value is = ${this.XPvalue}`)

    //   //mark individual exercise as complete
    //   this.updateActiveExerciseWithFinish
    //   console.log(`Player ${this.userValue} has finish exercise id ${this.activeexerciseId}`)

    //   //change the icon
    //   const h5Element = e.currentTarget.querySelector("h5")
    //   // Changing the colors of the buttons depending on their value (negative or positive)
    //   if (e.currentTarget.value > 0) {
    //     e.currentTarget.classList.remove("button");
    //     e.currentTarget.classList.add("button-regular-done");

    //     //Mark the XP as earned
    //     h5Element.innerHTML = "XP\ngained";
    //   } else {
    //     e.currentTarget.classList.remove("button-regular-done");
    //     e.currentTarget.classList.add("button");

    //     //Mark the XP as earned
    //     h5Element.textContent = `${e.currentTarget.value * -1}XP`;
    //   }

    //   // Increasing the width of the bar
    //   this.barWidth += parseInt(e.currentTarget.value,10);
    //   this.barTarget.style.width = `${(this.barWidth / this.barEndNumber) * 100}%`
    //   console.log(this.barWidth)

    //   // Update the exp value printed at the bottom
    //   this.barExpTarget.innerHTML = `${this.barWidth}`

    //   // Change the value of the button to negative
    //   e.currentTarget.value = e.currentTarget.value * -1

    //   // End Game with Finish
    //   if (this.XPvalue == this.endValue) {
    //     this.finishSound.play()
    //     this.updateUserGameDatumWithFinish();
    //     console.log("REGULAR GAME FINISH");
    //     this.showBonusModal();
    //   };
    // }

    updateUserGameDatumWithFinish() {
      // Update the data to the ruby controller
        fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.csrfToken
          },
          body: JSON.stringify({game_xp: this.XPvalue, finish: true, time_taken: this.secondsLeftValue - this.secondsUntilEnd, user_game_datum_id: this.dataIdValue})
        });
    }

    showBonusModal() {
      // Currently it shows buttons but it needs to show modals
      console.log(this.Modal)
      this.Modal.classList.remove("hidden-modal");
      this.Modal.classList.add("game-modal");
    }



  }
