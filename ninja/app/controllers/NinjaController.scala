package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.ninja.NinjaGame
import de.htwg.se.ninja.controller.component.State
import de.htwg.se.ninja.model.component.component.component.component.Direction



/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class NinjaController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController = NinjaGame.controller

  def ninjaAsText = NinjaGame.tui.stateToString()



  def player(player: String)= Action{
    gameController.setName(player)
    Ok(views.html.ninja(gameController))
  }

  def setFlag(row: Int, col: Int)= Action{
    gameController.setFlag(row,col)
    Ok(views.html.ninja(gameController))
  }

  def walk(row: Int, col: Int, d: String)= Action{

    val dir = StringToDirection(d)
    print(dir)
    gameController.walk(row,col,dir)
    Ok(views.html.ninja(gameController))
  }

  def changeTurn()= Action{
    gameController.changeTurns()
    Ok(views.html.ninja(gameController))
  }

  def StringToDirection(d: String): Direction.direction = d match {
    case "r" => Direction.right
    case "l" => Direction.left
    case "u" => Direction.up
    case "d" => Direction.down
    case _  => Direction.up }

  def about = Action {
    Ok(views.html.index())
  }

  def ninja = Action {
    Ok(views.html.ninja(gameController))
  }

}
