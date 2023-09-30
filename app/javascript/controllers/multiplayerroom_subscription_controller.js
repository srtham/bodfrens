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
    static targets = ["exercise", "button", "bar", "timer", "xp", "barExp", "barFinalExp", "bonusButton"]

    connect() {

    //create multiplayerroom_subscription_channel
    this.channel = createConsumer().subscriptions.create(
      { channel: "MultiplayerChannel", id: this.roomIdValue },
      { received: data => console.log(data) }
    )
    console.log(`Subscribed to the multiplayerroom with the id ${this.roomIdValue}.`)

    this.csrfToken = document.querySelector("meta[name='csrf-token']").content
    }

    markComplete(e) {
      e.preventDefault()
      this.buttonSound.play()
      this.XPvalue = this.XPvalue + parseInt(e.currentTarget.value,10);
      console.log(`the XP value is = ${this.XPvalue}`)

      //mark individual exercise as complete
      this.updateActiveExerciseWithFinish
      console.log(`Player ${this.userValue} has finish exercise id ${this.activeexerciseId}`)

      //change the icon
      const h5Element = e.currentTarget.querySelector("h5")
      // Changing the colors of the buttons depending on their value (negative or positive)
      if (e.currentTarget.value > 0) {
        e.currentTarget.classList.remove("button");
        e.currentTarget.classList.add("button-regular-done");

        //Mark the XP as earned
        h5Element.innerHTML = "XP\ngained";
      } else {
        e.currentTarget.classList.remove("button-regular-done");
        e.currentTarget.classList.add("button");

        //Mark the XP as earned
        h5Element.textContent = `${e.currentTarget.value * -1}XP`;
      }

      // Increasing the width of the bar
      this.barWidth += parseInt(e.currentTarget.value,10);
      this.barTarget.style.width = `${(this.barWidth / this.barEndNumber) * 100}%`
      console.log(this.barWidth)

      // Update the exp value printed at the bottom
      this.barExpTarget.innerHTML = `${this.barWidth}`

      // Change the value of the button to negative
      e.currentTarget.value = e.currentTarget.value * -1

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
