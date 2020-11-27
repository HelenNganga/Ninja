let game = {
    desk: {
        field: [],
        player1: [],
        player2: [],
    }
};
const defaultGame = game;

$(".game").append(initButtons())



function addPlayer1() {
    let div = $('<div/>', {
        'class': 'form-group',
    });
    div.append($('<label/>', {
        for: 'input-name1',
        text: 'Name'
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

    $("#player1-add").empty();
    $("#player1-add").append(div);
    $("#player1-add").append(btnConfirmName1);
}

function addPlayer2() {
    let div = $('<div/>', {
        'class': 'form-group',
    });
    div.append($('<label/>', {
        for: 'input-name2',
        text: 'Name'
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

    $("#player2-add").empty();
    $("#player2-add").append(div);
    $("#player2-add").append(btnConfirmName2);
}

function initButtons() {
    $.ajax({
        method: "GET",
        url: "/state",
        dataType: "text",
        success: result => {
            switch (result) {
                case "INSERTING_NAME_1":
                   game.append(addPlayer1());
                    break;
                case "INSERTING_NAME_2":
                    game.append(addPlayer2());
                    break;
            }
        }
    });
}


function update(result) {
    console.log(result);
    game = result;
    initButtons();
}


doc2 = document.getElementById("btn-confirmName2")
if (doc2) {
    doc2.addEventListener("click", addPlayer2);
}

doc3 = document.getElementById("btn-flag1")
if (doc3) {
    doc3.addEventListener("click", setFlag1);
}




function addFlag1() {
    let flag = document.getElementById("flag1-input").value;
    console.log("Flag" + flag);
    return window.location.href = "http://localhost:9000/setFlag/00";
}

function addFlag2() {
    let flag = document.getElementById("flag2-input").value;
    return window.location.href = "http://localhost:9000/setFlag/55";
}

function setFlag1() {

    let row = document.getElementById('row-select').value;
    let col = document.getElementById('col-select').value;
    console.log("row:" + row, "col:" + col)
    let route = ("http://localhost:9000/setFlag/" + row + col)
    return window.location.href = route;
}