doc1 = document.getElementById("btn-confirmName1")
if(doc1) {
    doc1.addEventListener("click", addPlayer1);
}
doc2 = document.getElementById("btn-confirmName2")
if(doc2) {
    doc2.addEventListener("click", addPlayer2);
}

doc3 = document.getElementById("btn-turn")
if(doc3) {
    doc3.addEventListener("click", walk);
}

doc4 = document.getElementById("btn-next")
if(doc4) {
    doc4.addEventListener("click", next);
}

for(let row = 0 ; row < 6; row++){
    for(let col = 0; col < 6; col++){
        let tmp = row.toString().concat(col.toString())
        let cell=document.getElementById(tmp);
        if(cell){
            cell.addEventListener("click", getId)
        }
    }
}

function addPlayer1() {
    let name = document.getElementById("input-name1").value;
    return window.location.href = "http://localhost:9000/addPlayer1/" + name;
}

function addPlayer2() {
    let name = document.getElementById("input-name2").value;
    return window.location.href = "http://localhost:9000/addPlayer2/" + name;
}

let buttonId;
function getId(){
   return buttonId = this.id;
}

function walk(){
    let direction = document.getElementById("direction-select").value;
    console.log(direction);
    let dir = direction.charAt(0).toLowerCase();
   return window.location.href = "http://localhost:9000/walk/" + buttonId + dir;
}

function next(){
    return window.location.href ="http://localhost:9000/f";
}