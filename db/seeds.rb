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
  { title: "5 Air Push-Ups", description: "Basic push-ups for upper body strength.", exercise_xp: 30, is_bonus: false, image_url: "animationsFA/Push_ups.gif" },
  { title: "6 Kicks", description: "Core exercise focusing on the abdominal muscles.", exercise_xp: 30, is_bonus: false, image_url: "animationsFA/Sit_ups.gif" },
  { title: "6 Alt Lunges", description: "Great for leg muscle and strength.", exercise_xp: 40, is_bonus: false, image_url: "animationsFA/Alt_Leg_Lunge.gif" },
  { title: "6 Raise Basket", description: "Full body strength and aerobic exercise.", exercise_xp: 35, is_bonus: false, image_url: "animationsFA/HalfBurpees.gif" },
  { title: "5 Go Toilet", description: "Excellent for building lower body strength.", exercise_xp: 25, is_bonus: false, image_url: "animationsFA/Squats.gif" },
  { title: "5 Jumping Jacks", description: "Good for cardiovascular fitness.", exercise_xp: 15, is_bonus: true, image_url: "animationsFA/Jumping_Jacks.gif" },
  { title: "6 Marches", description: "Works on your back and arm muscles.", exercise_xp: 20, is_bonus: true, image_url: "animationsFA/High_knee.gif" },
  { title: "5 Kallang Wave", description: "Effective abdominal exercise.", exercise_xp: 20, is_bonus: true, image_url: "animationsFA/Crunches.gif" }
]
exercise_data.each do |data|
  Exercise.create(data)
end

puts "Clearing all Badges"
Badge.destroy_all
puts "Clearing done"
puts "create 10 exercise"
badge = [
  { title: "Friend Supporter", description: "Play one game with a friend", image_url: "pngs/bodfrens_graphics-05.png" },
  { title: "Lone Wolf", description: "Complete 3 single player games", image_url: "pngs/bodfrens_graphics-08.png" },
  { title: "First Game", description: "Play your first bodfrens game", image_url: "pngs/bodfrens_graphics-07.png" },
  { title: "Bonus Bunny", description: "Finish three bonus rounds", image_url: "pngs/bodfrens_graphics-09.png" },
  { title: "Quitter", description: "Um, quit a game?", image_url: "pngs/bodfrens_graphics-06.png" }
]

badge.each do |data|
  Badge.create(data)
end
