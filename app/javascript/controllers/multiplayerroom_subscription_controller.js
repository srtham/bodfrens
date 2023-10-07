import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

// Connects to data-controller="multiplayerroom-subscription"
export default class extends Controller {
    static values = {
      roomId: Number,
      secondsUntilEnd: Number,
      currentUser: Number,
      opponentUser: Number,
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

    static targets = ["exercise", "button", "barCurrentUser", "timer", "xp", "barExpCurrentUser", "barFinalExpCurrentUser", "barOpponentUser", "bonusButton", "player1exercise", "player2exercise", ]


    connect() {

    this.startSound = new Audio("/audios/start.mp3")
    this.buttonSound = new Audio("/audios/clicksound.mp3")
    this.finishSound = new Audio("/audios/Finish.wav")

    this.csrfToken = document.querySelector("meta[name='csrf-token']").content;

    this.startSound.play()

    this.leftGameAlert = document.querySelector(".left-game")
    this.opponentRightDisplay = document.getElementById("opponent-right-display")

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
            this.updateUserGameDatumWithFinish(reg_finish_hash);
            this.changeGiveUpButtonBonusRound(reg_finish_hash.user_id);
            };
            // To mark a user_game_data with a finished properly
            const finishedUserId = reg_finish_hash.user_id;
            this.showOpponentFinishedTag(finishedUserId);
          } else if (received_data.hasOwnProperty("bonus_finish")) {
            const bonus_finish_hash = received_data;

            if (bonus_finish_hash.user_id === this.currentUserValue) {
            clearInterval(this.countdown);
            this.timerTarget.innerHTML = `Finished`;
            this.updateUserGameDatumWithBonusFinish(bonus_finish_hash);
            };

            const finishedUserId = bonus_finish_hash.user_id;
            this.showOpponentFinishedTag(finishedUserId);

          } else if (received_data.hasOwnProperty("start_bonus")) {
            if (received_data.start_bonus == true) {
              location.reload();
            };

          } else if (received_data.hasOwnProperty("user_who_chose_bonus_id")) {
            const userWhoChoseBonusId = received_data.user_who_chose_bonus_id;
            this.showOpponentBonusTag(userWhoChoseBonusId);

          } else if (received_data.hasOwnProperty("disconnect")) {
            this.opponentRightDisplay.style = "display: none";
            this.leftGameAlert.style = "display: block";
          } else if (received_data.hasOwnProperty("connect")) {
            this.opponentRightDisplay.style = "display: block";
            this.leftGameAlert.style = "display: none";
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
         if (this.bonusValue) {
         const completeTag = document.querySelector(".workout-complete-bonus");
         completeTag.style = "display:block";
         } else {
          const completeTag = document.querySelector(".workout-complete");
          completeTag.style = "display:block";
         }
       };
     };

    update_active_exercise(active_exercise) { // To update the buttons and XP bars and values after the data is received back from the controller.
      // this.buttonSound.play()
      const activeExerciseElement = this.player1exerciseTarget.querySelector(`[id="${active_exercise.id}"]`);
      const activeExerciseOpponentElement = this.player2exerciseTarget.querySelector(`[id="${active_exercise.id}"]`);

      // Scenario 1 --  When data is updating the current user's buttons and the exercises was checked 'completed'.
      if (activeExerciseElement !== null && active_exercise.complete === true) {
        // 1. add the XP (overall game)
        this.currentUserXpValue += active_exercise.xp
        // 2. change the buttons
        const h5Element = activeExerciseElement.querySelector("h5")
        h5Element.innerHTML = "XP\ngained";
        activeExerciseElement.classList.remove("button-user");
        activeExerciseElement.classList.add("button-user-selected");
        if (this.bonusValue) {
          activeExerciseElement.classList.add("bonus-color");
        }
        // 3. change the bar and the game room XP total
        //// have to -1 here because we already changed the value of the button earlier
        this.currentUserBarWidth += ( parseInt(activeExerciseElement.value,10) * -1 );
        this.barExpCurrentUserTarget.innerHTML = `${this.currentUserBarWidth}`;
        this.barCurrentUserTarget.style.width = `${(this.currentUserBarWidth / this.currentUserBarEndNumber) * 100}%`;
      };


      // Scenario 2 --  When data is updating the current user's buttons and the exercises was checked 'NOT completed'.
      if (activeExerciseElement !== null && active_exercise.complete === false) {
        // 1. add the XP (overall game)
        this.currentUserXpValue -= active_exercise.xp;
        // 2. change the buttons
        const h5Element = activeExerciseElement.querySelector("h5");
        activeExerciseElement.classList.add("button-user");
        activeExerciseElement.classList.remove("button-user-selected");
        if (this.bonusValue) {
          activeExerciseElement.classList.remove("bonus-color");
        }
        h5Element.innerHTML = `${active_exercise.xp}XP`;
        // 3. change the bar and the game room XP total
        //// have to -1 here because we already changed the value of the button earlier
        this.currentUserBarWidth += ( parseInt(activeExerciseElement.value,10) * -1 );
        this.barExpCurrentUserTarget.innerHTML = `${this.currentUserBarWidth}`;
        this.barCurrentUserTarget.style.width = `${(this.currentUserBarWidth / this.currentUserBarEndNumber) * 100}%`;
      };

      // Scenario 3 --  When data is updating the opponent* user's buttons and the exercises was checked 'completed'.
      if (activeExerciseOpponentElement !== null && active_exercise.complete === true) {
        // 1. add the XP (overall game)
        this.opponentUserXpValue += active_exercise.xp
        // 2. change the buttons
        activeExerciseOpponentElement.classList.remove("opponent-button");
        activeExerciseOpponentElement.classList.add("opponent-button-gray");
        // 3. change the bar and the game room XP total
        this.opponentUserBarWidth += ( parseInt(activeExerciseOpponentElement.value,10) );
        this.barOpponentUserTarget.style.width = `${(this.opponentUserBarWidth / this.opponentUserBarEndNumber) * 100}%`;

      };

      // Scenario 4 --  When data is updating the opponent* user's buttons and the exercises was checked 'NOT completed'.
      if (activeExerciseOpponentElement !== null && active_exercise.complete === false) {
        // 1. add the XP (overall game)
        this.opponentUserXpValue -= active_exercise.xp;
        // 2. change the buttons
        activeExerciseOpponentElement.classList.add("opponent-button");
        activeExerciseOpponentElement.classList.remove("opponent-button-gray");
        // 3. change the bar and the game room XP total
        this.opponentUserBarWidth -= ( parseInt(activeExerciseOpponentElement.value,10) );
        this.barOpponentUserTarget.style.width = `${(this.opponentUserBarWidth / this.opponentUserBarEndNumber) * 100}%`;
      };
    };



    updateActiveExercise(e) { // To send requests to the controller
      this.buttonSound.play()
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
      this.finishSound.play()
      // Update the data to the ruby controller
        const user_game_data_id = reg_finish_hash.user_game_data_id
        console.log("Game updated with finished!")
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
      this.finishSound.play()
      // then update the user with the bonus_finish and the new time
      // So you need to get the time from the last room
      // That should be done in the controller and then sent to the javascript so that the User Game Datum can be updated.
      // After which the bonus modal should pop up asking if you want to wait for your friend or not.
      const user_game_data_id = bonus_finish_hash.user_game_data_id
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

    changeGiveUpButtonBonusRound(finishedUserId){
      const showButton = document.getElementById("showButton");
      const hideButton = document.getElementById("hideButton");
      const showModalClass = document.querySelector('.show-from-modal');
      const hideModalClass = document.querySelector('.hide-from-modal');
      const yesShowModalClassButton = document.getElementById("yes-show-modal-button");
      const yesHideModalClassButton = document.getElementById("yes-hide-modal-button");

      if (finishedUserId === this.currentUserValue){
        showButton.style.display = "block";
        hideButton.style.display = "none";
        showModalClass.style.display = "block";
        hideModalClass.style.display = "none";
        yesShowModalClassButton.style = "width: 150px; height: 50px; display: flex;"
        yesHideModalClassButton.style = "width: 150px; height: 50px; display: none;"
      }
    }

    disconnect() {
      this.channel.unsubscribe()
    }



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
