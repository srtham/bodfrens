# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
# db/seeds.rb

# You can optionally clear existing exercises
puts "Clearing all Exercises"
Exercise.destroy_all
puts "Clearing done"

puts "Clearing all User Data"
UserGameDatum.destroy_all
puts "Clearing done"

puts "create 10 exercise"
# Create 10 example exercises
exercise_data = [
  { title: "Push-ups", description: "Basic push-ups for upper body strength.", exercise_xp: 10, is_bonus: false, image_url: "animationsFA/Push_ups.gif" },
  { title: "Sit-ups", description: "Core exercise focusing on the abdominal muscles.", exercise_xp: 8, is_bonus: false, image_url: "animationsFA/Sit_ups.gif" },
  { title: "Lunges", description: "Great for leg muscle and strength.", exercise_xp: 9, is_bonus: false, image_url: "animationsFA/Alt_Leg_Lunge.gif" },
  { title: "Plank", description: "Core strengthening and stability.", exercise_xp: 12, is_bonus: false, image_url: "animationsFA/Push_ups.gif" },
  { title: "Mountain Climbers", description: "Full body workout with a focus on the core.", exercise_xp: 15, is_bonus: false, image_url: "animationsFA/High_knee.gif" },
  { title: "Burpees", description: "Full body strength and aerobic exercise.", exercise_xp: 20, is_bonus: true, image_url: "animationsFA/HalfBurpees.gif" },
  { title: "Squats", description: "Excellent for building lower body strength.", exercise_xp: 10, is_bonus: true, image_url: "animationsFA/Squats.gif" },
  { title: "Jumping Jacks", description: "Good for cardiovascular fitness.", exercise_xp: 5, is_bonus: true, image_url: "animationsFA/Jumping_Jacks.gif" },
  { title: "Pull-ups", description: "Works on your back and arm muscles.", exercise_xp: 18, is_bonus: true, image_url: "animationsFA/High_knee.gif" },
  { title: "Bicycle Crunches", description: "Effective abdominal exercise.", exercise_xp: 12, is_bonus: true, image_url: "animationsFA/Crunches.gif" }
]

exercise_data.each do |data|
  Exercise.create(data)
end
