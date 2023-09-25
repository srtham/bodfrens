// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import CopyTextController from "./copy_text_controller"
application.register("copy-text", CopyTextController)

import GameController from "./game_controller"
application.register("game", GameController)

import HelloController from "./hello_controller"
application.register("hello", HelloController)

import TimerController from "./timer_controller"
application.register("timer", TimerController)
