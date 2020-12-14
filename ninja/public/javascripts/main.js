let buttonId;
let currentPlayer;
let name;

let game = {
    desk: {
        field: {},
        player1: [],
        player2: [],
    }
};
const defaultGame = game;
let socket = new WebSocket("ws://localhost:9000/websocket");


function getCurrentPlayer() {
        if (game.desk.player1.state === 'go') {
            currentPlayer = '1';
            return currentPlayer;
        } else {
            currentPlayer = '2';
            return currentPlayer;
        }
}

function getCurrentPlayerName() {
    if (game.desk.player1.state === 'go') {
        return name = game.desk.player1.name;
    } else {
        return name = game.desk.player2.name;
    }
}

function initCurrentPlayerName() {
    let div = $('<div/>', {
        'class': 'form-group',
    });
    div.append($('<label/>', {
        text: getCurrentPlayerName() + " it's your turn!"
    }));
    $("#current-player").empty().append(div);

}

function initField() {
    let counter = 0;
    let div = $('<div/>', {
        class: 'field-container'
    });

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {

            let playerId = game.desk.field[counter]?.cell.ninja.playerId
            let cellText = ' . '
            let cellClass = 'emptyButton'
            if(playerId == getCurrentPlayer()) {
                switch(game.desk.field[counter].cell.ninja.weapon) {
                    case 'f':
                        cellClass = "fieldButtonFlag"
                        break;
                    case 's':
                        cellClass= "fieldButtonScissor"
                        break;
                    case 'r':
                        cellClass= "fieldButtonRock"
                        break;
                    case 'p':
                        cellClass= "fieldButtonPaper"
                        break;
                    default:
                        cellClass ="fieldButton"
                        cellText = "NotWorking"
                }
            } else if (playerId && playerId != getCurrentPlayer() ) {
                cellClass = "opponentButton";
                cellText = "_"
            } else {
                cellClass = "emptyButton";
            }

            div.append($('<button/>', {
                id: row.toString().concat(col.toString()),
                text: cellText,
                class: cellClass,
                click: () => {
                    buttonId = row.toString().concat(col.toString());
                }

            }));
            counter++;
        }
    }
    $("#field").empty().append(div);
}

function addPlayer1() {
    let div = $('<div/>', {
        'class': 'form-group',
    });
    div.append($('<label/>', {
        for: 'input-name1',
        text: 'Player1, insert your name'
    }));
    div.append($('<input/>', {
        id: 'input-name1',
        placeholder: 'Player1',
        type: 'text',
        class: 'form-control'
    }));

    let btnConfirmName1 = $('<button/>', {
        text: 'Add Player',
        id: 'btnConfirmName1',
        "class": "btn btn-primary",
        click: () => {
            let player1 = $("#input-name1").val();
            sendToSocket(JSON.stringify({type: "player1", name: player1}))
        }
    });
    $("#interaction").empty().append(div).append(btnConfirmName1);
}

function addPlayer2() {
    let div = $('<div/>', {
        'class': 'form-group',
    });
    div.append($('<label/>', {
        for: 'input-name2',
        text: 'Player2, insert your name'
    }));
    div.append($('<input/>', {
        id: 'input-name2',
        placeholder: 'Player2',
        type: 'text',
        class: 'form-control'
    }));

    let btnConfirmName2 = $('<button/>', {
        text: 'Add Player',
        id: 'btnConfirmName2',
        "class": "btn btn-primary",
            click: () => {
                let player2 = $("#input-name2").val();
                sendToSocket(JSON.stringify({type: "player2", name: player2}))
            }
    });
    $("#interaction").empty().append(div).append(btnConfirmName2);
}

function setFlag1() {
    let div = $('<div/>', {
        'class': 'form-group',
    });
    div.append($('<p/>', {
        for: 'label-flag1',
        text: 'Player1, set your Flag!'
    }));

    let confirmFlag1 = $('<button/>', {
        text: 'Set Flag!',
        id: 'btn-flag1',
        "class": "btn btn-primary",
        click: () => {
            let row = buttonId.toString().charAt(0)
            let col = buttonId.toString().charAt(1)
            sendToSocket(JSON.stringify({type: "setFlag1", row: row, col: col}))
        }

    });
    $("#interaction").empty().append(div).append(confirmFlag1);
}

function setFlag2() {
    let div = $('<div/>', {
        'class': 'form-group',
    });
    div.append($('<p/>', {
        for: 'label-flag2',
        text: 'PLayer2, set your Flag!'
    }));

    let confirmFlag2 = $('<button/>', {
        text: 'Set Flag!',
        id: 'btn-flag2',
        "class": "btn btn-primary",
        click: () => {
            let row = buttonId.toString().charAt(0)
            let col = buttonId.toString().charAt(1)
            sendToSocket(JSON.stringify({type: "setFlag2",row:row, col:col}))
        }
    });
    $("#interaction").empty().append(div).append(confirmFlag2);
}

function createNextButtons() {
    let btnNext = $('<button/>', {
        text: 'Next Player',
        id: 'btnNext',
        "class": "btn btn-primary",
        click: () => {
            sendToSocket(JSON.stringify({type: "next"}))
        }
    });

    $("#interaction").empty().append(btnNext);
}

function walk() {
    let div = $('<div/>', {
        'class': 'form-group',
    });
    div.append($('<p/>', {
        for: 'direction-label',
        text: 'Choose a direction!'
    }));
    div.append($('<input/>', {
        id: 'direction-input',
        type: 'text',
        class: 'form-control'
    }));

    let btnWalk = $('<button/>', {
        text: 'Walk',
        id: 'btn-walk',
        "class": "btn btn-primary",
        click: () => {
            let direction = $("#direction-input").val();
            let row = buttonId.toString().charAt(0)
            let col = buttonId.toString().charAt(1)
            sendToSocket(JSON.stringify({type: "walk",row: row,col: col,d: direction}))
        }
    });
    $("#interaction").empty().append(div).append(btnWalk);
}

function initButtons() {
    console.log("initButons")
    $.ajax({
        method: "GET",
        url: "/state",
        dataType: "text",
        success: result => {
            switch (result) {
                case "INSERTING_NAME_1":
                    $(".game").append(addPlayer1());
                    break;
                case "INSERTING_NAME_2":
                    $(".game").append(addPlayer2());
                    break;
                case "SET_FLAG_1":
                    $(".game").append(setFlag1());
                    break;
                case "SET_FLAG_2":
                    $(".game").append(setFlag2());
                    break;
                case "TURN":
                    $(".game").append(walk());
                    break;
                case "WALKED":
                    $(".game").append(createNextButtons());
                    break;
            }
        }
    });
}

function update(result) {
    game = result;
    console.log("UPDATE" + game)
    initField();
    initButtons();
    initCurrentPlayerName();
}

function init() {
    $.ajax({
        method: "GET",
        url: "/json",
        dataType: "json",
        success: result => update(result)
    });
}

$(document).ready(function () {
    console.log('The DOM is ready!');
    init();
    initField();
    initButtons();
    initCurrentPlayerName();
});

connectWebSocket()

function connectWebSocket() {
    console.log(socket)
    socket.setTimeout

    socket.onopen = function(event) {
        console.log("Connected to Websocket");
        sendToSocket(JSON.stringify({type: "createGame"}))
    }

    socket.onclose = function () {
        console.log('Connection with Websocket Closed!');
    };

    socket.onerror = function (error) {
        console.log('Error in Websocket Occured: ' + error);
    };

    socket.onmessage = function (e) {
        console.log("in onmessage")

        if (typeof e.data === "string") {
            let json = JSON.parse(e.data);
            update(json)
            console.log(json);
        }

    };
}

function sendToSocket(msg) {
    socket.send(msg);
}