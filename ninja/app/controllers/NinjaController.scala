package controllers

import java.util
import java.util.{Observable, Observer}

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import play.api.mvc._
import de.htwg.se.ninja.NinjaGame
import de.htwg.se.ninja.controller.ControllerInterface
import de.htwg.se.ninja.model.component.component.component.component.Direction
import de.htwg.se.ninja.model.component.component.component.component.Direction.direction
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
  val observer = new NinjaObserver();

  var socketToSend: NinjaWebSocketActorFactory.type = null;

  def interaction(message: String) {
    System.out.println("Message" + message)
    val body = Json.parse(message)
    val type1 = (body \ "type").get.as[String]
    val result = type1 match {
      case "createGame" => ninja()
      case "state" => state()
      case "player1" => player((body \ "name").get.as[String])
      case "player2" => player((body \ "name").get.as[String])
      case "setFlag1" => setFlag((body \ "row").get.as[String], (body \ "col").get.as[String])
      case "setFlag2" => setFlag((body \ "row").get.as[String], (body \ "col").get.as[String])
      case "walk" => walk((body \ "row").get.as[String], (body \ "col").get.as[String], (body \ "d").get.as[String])
      case "next" => changeTurn()
      case "state" => state()
    }
    observer.notifyObservers();
    Ok(result.toString)
  }

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

  def player(name: String): JsObject = {
    controller.setName(name)
    controller.toJson
  }

  def setFlag(row: String, col: String): JsObject = {
    val rowInt = row.toInt
    val colInt = col.toInt
    controller.setFlag(rowInt, colInt)
    controller.toJson
  }

  def walk(row: String, col: String, d: String): JsObject = {
    val rowInt = row.toInt
    val colInt = col.toInt
    val dir = StringToDirection(d)
    controller.walk(rowInt, colInt, dir)
    controller.toJson
  }

  def changeTurn() = {
    controller.changeTurns()
    controller.toJson
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
      val tmp = NinjaWebSocketActorFactory;
      socketToSend = tmp;
      tmp.create(out)
    }
  }

  object NinjaWebSocketActorFactory {
    def create(out: ActorRef) = {
      Props(new NinjaWebSocketActor(out))
    }
  }

  class NinjaWebSocketActor(out: ActorRef) extends Actor with Reactor with NinjaObservable {
    listenTo(controller)

    observer.addObserver(this)


    def receive = {
      case msg: String =>
        out ! (controller.toJson.toString)
        interaction(msg)
        println("Sent Json to Client" + msg)
        sendJsonToClient
    }

    def sendJsonToClient = {
      println("Received event from Controller")
      out ! (controller.toJson.toString)
    }

    override def update(): Unit = {
      sendJsonToClient
    }
  }

}

class NinjaObserver {
  var list = new util.ArrayList[NinjaObservable]();
  def addObserver(o: NinjaObservable): Unit = {
    list.add(o)
  }
  def notifyObservers() {list.forEach(e => e.update())}

}

trait NinjaObservable {
  def update()
}

