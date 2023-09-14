class ExercisesController < ApplicationController
  def index
    @exercises = Exercise.all
  end

  def image_url
    # Your logic here to generate the image URL
  end
end
