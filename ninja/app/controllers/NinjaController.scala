package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.ninja.NinjaGame
import de.htwg.se.ninja.controller.ControllerInterface
import de.htwg.se.ninja.model.component.component.component.component.Direction


/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

@Singleton
class NinjaController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val controller: ControllerInterface = NinjaGame.controller

  def ninjaAsText = NinjaGame.tui.stateToString()

  def state = Action {
    Ok(controller.state.toString)
  }

  def home = Action {
    Ok(views.html.home())
  }

  def ninja = Action {
    Ok(views.html.ninja(controller))
  }

  def about = Action {
    Ok(views.html.index())
  }

  def highscore = Action {
    Ok(views.html.highscore())
  }


  def player(name: String) = Action {
    controller.setName(name)
    Ok(controller.storeFile.toString)
  }

  def setFlag(row: Int, col: Int) = Action {
    controller.setFlag(row, col)
    Ok(controller.storeFile.toString)
  }

  def walk(row: Int, col: Int, d: String) = Action {
    val dir = StringToDirection(d)
    controller.walk(row, col, dir)
    Ok(controller.storeFile.toString)
  }

  def changeTurn() = Action {
    controller.changeTurns()
    Ok(controller.storeFile.toString)
  }

  def StringToDirection(d: String): Direction.direction = d match {
    case "r" => Direction.right
    case "l" => Direction.left
    case "u" => Direction.up
    case "d" => Direction.down
    case _ => Direction.up
  }



}
