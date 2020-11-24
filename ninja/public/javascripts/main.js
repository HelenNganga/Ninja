doc1 = document.getElementById("btn-confirmName1")
if(doc1) {
    doc1.addEventListener("click", addPlayer1);
}
doc2 = document.getElementById("btn-confirmName2")
if(doc2) {
    doc2.addEventListener("click", addPlayer2);
}

doc3 = document.getElementById("btn-flag1")
if(doc3) {
    doc3.addEventListener("click", addFlag1);
}

doc4 = document.getElementById("btn-flag2")
if(doc4) {
    doc4.addEventListener("click", addFlag2);
}


function addPlayer1() {
    let name = document.getElementById("input-name1").value;
    console.log(name);
    return window.location.href = "http://localhost:9000/addPlayer1/" + name;
}

function addPlayer2() {
    let name = document.getElementById("input-name2").value;
    console.log(name);
    return window.location.href = "http://localhost:9000/addPlayer2/" + name;
}

function addFlag1(){
    let flag = document.getElementById("flag1-input").value;
    console.log("Flag"+flag);
    return window.location.href = "http://localhost:9000/setFlag/00";
}

function addFlag2(){
    let flag = document.getElementById("flag2-input").value;
    return window.location.href = "http://localhost:9000/setFlag/55";
}