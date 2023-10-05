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
      bonus: Boolean,
      currentUserPreviousTiming: Number
     }

    static targets = ["exercise", "button", "barCurrentUser", "timer", "xp", "barExpCurrentUser", "barFinalExpCurrentUser", "barOpponentUser", "bonusButton", "player1exercise", "player2exercise"]


    connect() {
    this.csrfToken = document.querySelector("meta[name='csrf-token']").content;

    //create multiplayerroom_subscription_channel
    this.channel = createConsumer().subscriptions.create(
      { channel: "MultiplayerChannel", id: this.roomIdValue },
      { received: data => {
          const received_data =JSON.parse(data)

          if (received_data.hasOwnProperty("xp")) {
            // to update an exercise as done/not done
            const active_exercise = received_data;
            this.update_active_exercise(active_exercise);
          } else if (received_data.hasOwnProperty("regular_finish")) {
            const reg_finish_hash = received_data;
            if (reg_finish_hash.user_id === this.currentUserValue) {
            clearInterval(this.countdown);
            this.timerTarget.innerHTML = `Finished`
            };

            // To mark a user_game_data with a finished properly

            this.updateUserGameDatumWithFinish(reg_finish_hash);

            const finishedUserId = reg_finish_hash.user_id;
            this.showOpponentFinishedTag(finishedUserId);
          } else if (received_data.hasOwnProperty("bonus_finish")) {
            const bonus_finish_hash = received_data;

            if (bonus_finish_hash.user_id === this.currentUserValue) {
            clearInterval(this.countdown);
            this.timerTarget.innerHTML = `Finished`
            };


            const finishedUserId = bonus_finish_hash.user_id;
            this.showOpponentFinishedTag(finishedUserId);
            this.updateUserGameDatumWithBonusFinish(bonus_finish_hash);
          } else if (received_data.hasOwnProperty("start_bonus")) {
            if (received_data.start_bonus == true) {
              location.reload();
            };
          } else if (received_data.hasOwnProperty("user_who_chose_bonus_id")) {
            const userWhoChoseBonusId = received_data.user_who_chose_bonus_id;
            this.showOpponentBonusTag(userWhoChoseBonusId);
          }
        }

      }
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
    this.currentUserBarEndNumber = this.currentUserEndXpValue
    this.opponentUserBarEndNumber = this.opponentUserEndXpValue
    this.currentUserBarWidth = 0
    this.opponentUserBarWidth = 0



    //set the final EXP printed at the bottom via innerHTML
    this.barFinalExpCurrentUserTarget.innerHTML = `/ ${this.currentUserBarEndNumber} XP EARNED`
    // this.opponentUserBarFinalExpTarget.innerHTML = `/${this.opponentUserBarEndNumber} XP EARNED` // to be changed
    }

    showOpponentBonusTag(userWhoChoseBonusId) {
     // Shows the opponent's orange bonus tag if he/she chooses to play bonus.
      if (userWhoChoseBonusId !== this.currentUserValue) {
        const bonusTag = document.querySelector(".bonus-round");
        bonusTag.style = "display:block";
      };
    };

    showOpponentFinishedTag(finishedUserId) {
      // Shows the opponent's orange bonus tag if he/she chooses to play bonus.
       if (finishedUserId !== this.currentUserValue) {
         const completeTag = document.querySelector(".workout-complete");
         completeTag.style = "display:block";
       };
     };

    update_active_exercise(active_exercise) { // To update the buttons
      // // this.buttonSound.play()

      //change the icon
      const activeExerciseElement = this.player1exerciseTarget.querySelector(`[id="${active_exercise.id}"]`);

      const activeExerciseOpponentElement = this.player2exerciseTarget.querySelector(`[id="${active_exercise.id}"]`);
      // console.log(`${activeExerciseOpponentElement} is the selected element.`)
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
          // console.log(`the current user xp value was added = ${this.currentUserXpValue}`)
        } else {
          this.opponentUserXpValue += active_exercise.xp;
        };


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

        //Mark the XP as removed
        if (this.currentUserDataIdValue === active_exercise.ugd_id) {
          this.currentUserXpValue -= active_exercise.xp;
          // console.log(`the current user xp value was deducted = ${this.currentUserXpValue}`)
        } else {
          this.opponentUserXpValue -= active_exercise.xp;
        };

      };

      if (activeExerciseElement !== null) {
        this.currentUserBarWidth += ( parseInt(activeExerciseElement.value,10) * -1 );
        // have to -1 here because we already changed the value of the button earlier
        this.barExpCurrentUserTarget.innerHTML = `${this.currentUserBarWidth}`;
        this.barCurrentUserTarget.style.width = `${(this.currentUserBarWidth / this.currentUserBarEndNumber) * 100}%`;
        console.log(`the current bar width ${(this.currentUserBarWidth / this.currentUserBarEndNumber) * 100}%`);

      };

      if (activeExerciseOpponentElement !== null) {
        /* we didn't change the value of the button after clicking, unlike the current_user
         which is why there is an if else statement here. */
        if (active_exercise.complete === true) {
          this.opponentUserBarWidth += ( parseInt(activeExerciseOpponentElement.value,10) );
        } else {
          this.opponentUserBarWidth -= ( parseInt(activeExerciseOpponentElement.value,10) );
        };
        this.barOpponentUserTarget.style.width = `${(this.opponentUserBarWidth / this.opponentUserBarEndNumber) * 100}%`;
        console.log(`the opponent bar width ${(this.opponentUserBarWidth / this.opponentUserBarEndNumber) * 100}%`);
      };
    };



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
    };

    updateUserGameDatumWithFinish(reg_finish_hash) {
      // Needs to stop the countdown so that it says "Round End"

      // Update the data to the ruby controller
        const user_game_data_id = reg_finish_hash.user_game_data_id
        console.log(user_game_data_id)
        fetch(`/room/${this.roomIdValue}/user_game_data/${user_game_data_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.csrfToken
          },
          body: JSON.stringify({game_xp: this.currentUserXpValue, finish: true, time_taken: this.timeElapsed, user_game_datum_id: user_game_data_id})
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
      // Needs to stop the countdown so that it says "Round End"

      // then update the user with the bonus_finish and the new time
      // So you need to get the time from the last room
      // That should be done in the controller and then sent to the javascript so that the User Game Datum can be updated.
      // After which the bonus modal should pop up asking if you want to wait for your friend or not.
      const user_game_data_id = bonus_finish_hash.user_game_data_id
      console.log(user_game_data_id)
      fetch(`/room/${this.roomIdValue}/user_game_data/${user_game_data_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.csrfToken
          },
          body: JSON.stringify({game_xp: this.currentUserXpValue, finish: true, bonus_finish: true, time_taken: this.currentUserPreviousTimingValue + this.timeElapsed, user_game_datum_id: user_game_data_id})
        })
        .then(response => {
          if (response.ok) {
            const user_id = bonus_finish_hash.user_id
            this.showBonusModal(user_id)
          } else {
            console.error("Failed to update user game data.");
          }
        })
      };


    showBonusModal(user_id) {
      const modal = document.getElementById(`bonusPromptModal`);
      console.log(modal)
      if (this.currentUserValue == user_id ) {
        modal.classList.remove("hidden-modal");
        modal.classList.add("game-modal");
      };
    };

    closeBonusEndModal(e) {
      e.preventDefault()
      // If the user decides to stay in the room after the bonus round ends.
      const modal = document.getElementById(`bonusPromptModal`);
      modal.classList.remove(".game-modal");
      modal.classList.add("hidden-modal");
      const exerciseDisplay = document.querySelector(".current-user");
      exerciseDisplay.style = "display:none";
      const waitDisplay = document.querySelector(".wait-message");
      waitDisplay.style = "display:flex";
    }

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

    updateWithChooseBonus(e) {
      e.preventDefault()
      fetch(`/room/${this.roomIdValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({finished_user: this.currentUserValue})
        })
        .then(response => {
          if (response.ok) {
            console.log("The room was updated with a patch.")
            // Show the wait message
            const exerciseDisplay = document.querySelector(".current-user");
            exerciseDisplay.style = "display:none";
            const waitDisplay = document.querySelector(".wait-message");
            waitDisplay.style = "display:flex";

            const modal = document.getElementById(`bonusPromptModal`);
            // console.log(modal);
            modal.classList.remove("game-modal");
            modal.classList.add("hidden-modal");
          } else {
            console.error("Failed to update the room with bonus.");
          }
        })
    }

    updateUserGameDatumWithBonusEnd(e) {
    // Update the data to the ruby controller
      console.log("Attempting to update UserGameDatum with bonus end...")
      e.preventDefault()
      fetch(`/room/${this.roomIdValue}/user_game_data/${this.currentUserDataIdValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({game_xp: this.currentUserXpValue, finish: true, bonus_finish: false, time_taken: this.timeElapsed + this.currentUserPreviousTimingValue, user_game_datum_id: this.currentUserDataIdValue})
      })
      .then(response => {
        if (response.ok) {
          window.location.href = `/room/${this.roomIdValue}/game_complete`;
        } else {
          // Handle errors if needed
          console.error("Failed to update user game data.");
        }
      })
    };

    updateUserGameDatumWithQuit(e) {
      e.preventDefault()
      fetch(`/room/${this.roomIdValue}/user_game_data/${this.currentUserDataIdValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({game_xp: this.currentUserXpValue - 100, finish: false, bonus_finish: false, time_taken: this.timeElapsed + this.currentUserPreviousTimingValue, user_game_datum_id: this.currentUserDataIdValue})
      })
      .then(response => {
        if (response.ok) {
          window.location.href = `/room/${this.roomIdValue}/game_complete`;
        } else {
          // Handle errors if needed
          console.error("Failed to update user game data.");
        }
      })
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
