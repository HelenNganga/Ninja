let buttonId;

let game = {
    desk: {
        field: {},
        player1: [],
        player2: [],
    }
};
const defaultGame = game;

function getCurrentPlayer() {
        if (game.desk.player1.state === 'go') {
            return currentPlayer = '1';
        } else {
            return currentPlayer = '2';
        }
}

function initF() {
    let counter = 0;
    let div = $('<div/>', {
        class: 'field-container'
    });

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {

            let cell = ' - '
            let c = 'emptyButton'
            if(game.desk.field[counter].cell.ninja.playerId) {
                c = "fieldButton"
                cell = game.desk.field[counter].cell.ninja.playerId + game.desk.field[counter].cell.ninja.weapon;
            }


            div.append($('<button/>', {
                id: row.toString().concat(col.toString()),
                text: cell,
                class: c,
                click: () => {
                    buttonId = row.toString().concat(col.toString());
                    console.log(buttonId)
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
            let name = $("#input-name1").val();
            $.ajax({
                method: "GET",
                url: "http://localhost:9000/addPlayer1/" + name,
                dataType: "json",
                success: result => update(result)
            })
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
            let name = $("#input-name2").val();
            $.ajax({
                method: "GET",
                url: "http://localhost:9000/addPlayer2/" + name,
                dataType: "json",
                success: result => update(result)
            })
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
            console.log(buttonId)
            $.ajax({
                method: "GET",
                url: "http://localhost:9000/setFlag/" + buttonId,
                dataType: "json",
                success: result => update(result)
            })
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
            console.log(buttonId)
            $.ajax({
                method: "GET",
                url: "http://localhost:9000/setFlag/" + buttonId,
                dataType: "json",
                success: result => update(result)
            })
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
            $.ajax({
                method: "GET",
                url: "http://localhost:9000/f",
                dataType: "json",
                success: () => update(defaultGame)
            })
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
            $.ajax({
                method: "GET",
                url: "http://localhost:9000/walk/" + buttonId + direction,
                dataType: "json",
                success: result => update(result)
            })
        }
    });
    $("#interaction").empty().append(div).append(btnWalk);
}

function initButtons() {
    $.ajax({
        method: "GET",
        url: "http://localhost:9000/state",
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
    initF();
    initButtons();
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
    initF();
    initButtons();
});