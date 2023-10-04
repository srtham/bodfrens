import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

// Connects to data-controller="multiplayerroom-subscription"
export default class extends Controller {
    static values = {
      roomId: Number,
      secondsUntilEnd: Number,
      currentUser: Number, // change this to current user
      opponentUser: Number, // change this to opponent
      currentUserDataId: Number,
      opponentUserDataId: Number,
      activeexerciseId: Number,
      secondsLeft: Number,
      currentUserXp: Number,
      opponentUserXp: Number,
      currentUserEndXp: Number,
      opponentUserEndXp: Number,
      timeTaken: Number,
      bonus: Boolean }
    static targets = ["exercise", "button", "barCurrentUser", "timer", "xp", "barExpCurrentUser", "barFinalExpCurrentUser", "barOpponentUser", "bonusButton", "player1exercise", "player2exercise"]

    connect() {
    this.csrfToken = document.querySelector("meta[name='csrf-token']").content;
    this.currentUserXpValue = 0
    this.opponentUserXpValue = 0


    //create multiplayerroom_subscription_channel
    this.channel = createConsumer().subscriptions.create(
      { channel: "MultiplayerChannel", id: this.roomIdValue },
      { received: data => {
        const received_data =JSON.parse(data)

        console.log(received_data)

        if (received_data.hasOwnProperty("xp")) {
          // to update an exercise as done/not done
          const active_exercise = received_data;
          this.update_active_exercise(active_exercise);
        } else if (received_data.hasOwnProperty("regular_finish")) {
          // To mark a user_game_data with a finished properly
          const reg_finish_hash = received_data;
          this.updateUserGameDatumWithFinish(reg_finish_hash);
          console.log(`User ${reg_finish_hash.user_id} has finished all regular active exercises.`);
        };

      } }
    )

    // logs to check start of game
    console.log(`Subscribed to the multiplayerroom with the id ${this.roomIdValue}.`);
    console.log(`this is the current_user id connected to the room = ${this.currentUserValue}`);
    console.log(`this is the opponent_user id connected to the room = ${this.opponentUserValue}`);
    console.log(`this is the current_user user_game_data_id = ${this.currentUserDataIdValue}`);
    console.log(`this is the opponent_user user_game_data_id = ${this.opponentUserDataIdValue}`);
    console.log(`this is the room ID = ${this.roomIdValue}`);
    console.log("The game is now connected");
    console.log(`This is the time taken from the other room = ${this.timeTakenValue}` );

    ///////////////////// TIMER SET UP
    //start counting the time
    this.timeElapsed = 0; // Use this variable to update how much time has passed.
    setInterval(() => {
      this.countTimeElapsed();
    }, 1000);
    // Set the secondsUntilEnd for the timer shown in the view
    this.secondsUntilEnd = this.secondsLeftValue;
    this.countdown = setInterval(this.countdown.bind(this), 1000);

    //set values for the bar calculations
    this.currentUserBarEndNumber = this.currentUserEndXpValue - this.currentUserXpValue
    this.opponentUserBarEndNumber = this.opponentUserEndXpValue - this.opponentUserXpValue
    this.currentUserBarWidth = 0
    this.opponentUserBarWidth = 0

    //set the final EXP printed at the bottom via innerHTML
    this.barFinalExpCurrentUserTarget.innerHTML = `/ ${this.currentUserBarEndNumber} XP EARNED`
    this.opponentUserBarFinalExpTarget.innerHTML = `/${this.opponentUserBarEndNumber} XP EARNED` // to be changed
    }

    update_active_exercise(active_exercise) { // To update the buttons
      // // this.buttonSound.play()

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
        if (this.currentUserDataIdValue === active_exercise.ugd_id) {
          this.currentUserXpValue += active_exercise.xp;
        } else {
          this.opponentUserXpValue += active_exercise.xp;
        }
        console.log(`the XP value of current_user is = ${this.currentUserXpValue}`)
        console.log(`the XP value of opponent user is = ${this.opponentUserXpValue}`)


      } else { // to mark as unfinished
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

      // Increasing the width of the bar of the current user
      this.currentUserBarWidth += parseInt(activeExerciseElement.value,10);
      this.barCurrentUserTarget.style.width = `${(this.currentUserBarWidth / this.currentUserBarEndNumber) * 100}%`
      console.log(this.currentUserBarWidth)

      // Update the exp value printed at the bottom of thsse current user
      this.barExpCurrentUserTarget.innerHTML = `${this.currentUserXpValue}`

      // Increasing the width of the bar of the opponent user
      this.opponentUserBarWidth += parseInt(activeExerciseElement.value,10);
      this.barOpponentUserTarget.style.width = `${(this.opponentUserBarWidth / this.opponentUserBarEndNumber) * 100}%`
      console.log(this.opponentUserBarWidth)
    }

    updateActiveExercise(e) { // To send requests to the controller
      e.preventDefault()
      // console.log(e.currentTarget)
      // console.log(e.currentTarget.value)
      if (e.currentTarget.value > 0) {
        fetch(`/room/${this.roomIdValue}/active_exercises/${e.currentTarget.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.csrfToken
          },
          body: JSON.stringify({active_exercise_id: Number(e.currentTarget.id), complete:true})
        })
      } else {
        fetch(`/room/${this.roomIdValue}/active_exercises/${e.currentTarget.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.csrfToken
          },
          body: JSON.stringify({active_exercise_id: Number(e.currentTarget.id), complete: false})
        })
      }


      e.currentTarget.value = e.currentTarget.value * -1
    }

    updateUserGameDatumWithFinish(reg_finish_hash) {
      // Update the data to the ruby controller
        const user_game_data_id = reg_finish_hash.user_game_data_id
        console.log(user_game_data_id)
        fetch(`/room/${this.roomIdValue}/user_game_data/${user_game_data_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.csrfToken
          },
          body: JSON.stringify({game_xp: 0, finish: true, time_taken: 0, user_game_datum_id: user_game_data_id})
        })
        .then(response => {
          if (response.ok) {
            const user_id = reg_finish_hash.user_id
            this.showBonusModal(user_id)
          } else {
            console.error("Failed to update user game data.");
          }
        })
    }

    updateUserGameDatumWithBonusFinish(bonus_finish_hash) {
      // STILL NOT YET DONE SINCE THE BONUS ROOM HAS NOT BEEN TRIGGERED
      // Update the data to the ruby controller
        fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.csrfToken
          },
          body: JSON.stringify({game_xp: 0, finish: true, bonus_finish: true, time_taken: 0, user_game_datum_id: this.dataIdValue})
        })
      };


    showBonusModal(user_id) {
      const modal = document.getElementById(`bonusPromptModal`);
      console.log(modal)
      if (this.playerOneValue == user_id ) {
        modal.classList.remove("hidden-modal");
        modal.classList.add("game-modal");
      };
    };

    countTimeElapsed() {
      this.timeElapsed++;
    }

    countdown() {
    //   // ends the countdown when the round is over.
    //   if (this.XPvalue == this.endValue) {
    //     clearInterval(this.countdown);
    //     this.timerTarget.innerHTML = "Round End"
    //     return
    //   }

      if (this.secondsUntilEnd <= 0) {
        clearInterval(this.countdown); // guard clause - this should call the modal
        this.timerTarget.innerHTML = "Time's Up!";
        if (this.bonusValue == true) {
          this.updateUserGameDatumWithTimesUp();
        } else {
          this.updateUserGameDatumWithTimesUp()
        }
        return
      }

      const minutesLeft = Math.floor(this.secondsUntilEnd / 60)
      const secondsLeft = Math.floor(this.secondsUntilEnd % 60).toString().padStart(2, '0')

      this.timerTarget.innerHTML = `${minutesLeft} : ${secondsLeft}`
      this.secondsUntilEnd = this.secondsUntilEnd - 1;
    };

    updateUserGameDatumWithTimesUp() {

    };

  };


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
