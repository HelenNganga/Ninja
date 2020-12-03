package controllers

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import play.api.mvc._
import de.htwg.se.ninja.NinjaGame
import de.htwg.se.ninja.controller.ControllerInterface
import de.htwg.se.ninja.model.component.component.component.component.Direction
import javax.inject._
import play.api.libs.json.{JsObject, JsValue, Json}
import play.api.libs.streams.ActorFlow
import play.api.mvc.{Action, _}

import scala.swing.Reactor


/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

@Singleton
class NinjaController @Inject()(cc: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {
  val controller: ControllerInterface = NinjaGame.controller

//  def interaction(message: String) {
//    val body = Json.parse(message)
//    val type1 = (body \ "type").get.as[String]
//    val result = type1 match {
//      case "createGame" => ninja()
//      case "addPlayer1" => player((body \ "player1").get.as[String])
//      case "addPlayer2" => player((body \ "player2").get.as[String])
//      case "setFlag" => setFlag((body \ "row").get.as[Int],(body \ "col").get.as[Int])
//      case "walk" => walk((body \ "row").get.as[Int],(body \ "col").get.as[Int],(body \ "d").get.as[String])
//      case "next" => changeTurn()
//    }
//    Ok(result)
//  }

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
    Ok(controller.toJson)
  }

  def setFlag(row: Int, col: Int) = Action {
    controller.setFlag(row, col)
    Ok(controller.toJson)
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

  def json(): Action[AnyContent] = Action {
    Ok(controller.toJson.toString())
  }

  def socket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      println("Connect received")
      NinjaWebSocketActorFactory.create(out)
    }
  }

  object NinjaWebSocketActorFactory {
    def create(out: ActorRef) = {
      Props(new NinjaWebSocketActor(out))
    }
  }

  class NinjaWebSocketActor(out: ActorRef) extends Actor with Reactor{
    listenTo(controller)

    def receive = {
      case msg: String =>
        out ! (controller.toJson.toString)
        println("Sent Json to Client"+ msg)
    }

//    reactions += {
//     case event: GridSizeChanged => sendJsonToClient
//     case event: CellChanged     => sendJsonToClient
//     case event: CandidatesChanged => sendJsonToClient
//    }

    def sendJsonToClient = {
      println("Received event from Controller")
      out ! (controller.toJson.toString)
    }
  }
}
