package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.ninja.NinjaGame
import scala.swing.Publisher


/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class NinjaController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController = NinjaGame.controller

  def ninjaAsText = NinjaGame.tui.stateToString()



  def about = Action {
    Ok(views.html.index())
  }

  def ninja = Action {
    Ok(ninjaAsText)
  }

}
