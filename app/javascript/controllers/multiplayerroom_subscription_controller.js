import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

// Connects to data-controller="multiplayerroom-subscription"
export default class extends Controller {
    static targets = ["exercise", "button", "bar", "timer", "xp", "barExp", "barFinalExp", "bonusButton", "player1exercise", "player2exercise"]

    static values = {
      roomId: Number,
      secondsUntilEnd: Number,
      end: Number,
      player1UserId: Number,
      player2UserId: Number,
      dataId: Number,
      activeexerciseId: Number,
      secondsLeft: Number,
      xp: Number,
      timeTaken: Number,
      bonus: Boolean}

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
    this.XPvalue = this.xpValue; // XP Value tracks how much the XP user has gathered so far in a game room.
    // bunch of logs to check if the data being sent is correct...
    console.log(`this is player 1 user_id connected to the room = ${this.player1UserIdValue}`);
    console.log(`this is player 2 user_id connected to the room = ${this.player2UserIdValue}`);
    console.log(`this is the ID of the user_game_data = ${this.dataIdValue}`);
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

    this.countdown = setInterval(this.countdown.bind(this), 1000) // sets the interval for countdown to reload every 1 second

    //set values for the bar calculations
    this.barEndNumber = this.endValue - this.xpValue
    this.barWidth = 0

    //set the final EXP printed at the bottom via innerHTML
    this.barFinalExpTarget.innerHTML = `/${this.barEndNumber} XP EARNED`
    }

    update_active_exercise(active_exercise) {

      const activeExerciseElement = this.player1exerciseTarget.querySelector(`#button-${active_exercise.id}`)

      const activeExerciseOpponentElement = this.player2exerciseTarget.querySelector(`#button-${active_exercise.id}`)
      // Changing the colors of the buttons depending on their value (negative or positive)
      if (active_exercise.complete) {

        if (activeExerciseOpponentElement !== null) {
          activeExerciseOpponentElement.classList.remove("opponent-button");
          activeExerciseOpponentElement.classList.add("opponent-button-gray");
          activeExerciseElement.value = activeExerciseElement.value * -1;
        }

        if (activeExerciseElement !== null) {
          const h5Element = activeExerciseElement.querySelector("h5")
          activeExerciseElement.classList.remove("button");
          activeExerciseElement.classList.add("button-regular-done");
          h5Element.innerHTML = "XP\ngained"
        }
      } else {
        activeExerciseElement.classList.remove("button-regular-done");
        activeExerciseElement.classList.add("button");

        //Mark the XP as earned
        // h5Element.textContent = `${activeExerciseElement.value * -1}XP`;
      }

      // Increasing the width of the bar
      this.barWidth += parseInt(activeExerciseElement.value,10);
      this.barTarget.style.width = `${(this.barWidth / this.barEndNumber) * 100}%`
      console.log(this.barWidth)

      // Update the exp value printed at the bottom
      this.barExpTarget.innerHTML = `${this.barWidth}`

      // End Game with Finish
      if (this.XPvalue == this.endValue) {
        this.finishSound.play()
        this.updateUserGameDatumWithFinish();
        console.log("REGULAR GAME FINISH");
        this.showBonusModal();
      };
    }

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

    updateActiveExerciseWithFinish(event) {
      fetch(`/room/${this.roomValue}/active_exercises/${event.currentTarget.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({active_exercise_id: Number(event.currentTarget.id), complete:true})
      });
    }

  }
