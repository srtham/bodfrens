class ActiveExercisesController < ApplicationController
  def update
    active_exercise = ActiveExercise.find(params[:active_exercise_id])
    active_exercise.complete = params[:complete]
    active_exercise.save
  end
end
