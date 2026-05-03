//#region querySelector
var buttons = document.querySelectorAll('button')
var header = document.querySelector("header")
var section = document.querySelector("section")
var article = document.querySelector('article')



var choixJoueur = document.querySelector("#choixJoueur")
var choixReseau = document.querySelector("#choixReseau")
var choixDifficulté = document.querySelector('#choixDifficulté')
choixJoueur.style.display = 'flex'



choixJoueur.children[0].addEventListener('click', choiceDifficultéSolo)
choixJoueur.children[1].addEventListener('click', choiceDifficultéMulti)

choixDifficulté.children[0].addEventListener('click', nextChoice)
choixDifficulté.children[1].addEventListener('click', nextChoice)
choixDifficulté.children[2].addEventListener('click', nextChoice)

choixReseau.children[0].addEventListener('click', nextChoice)
choixReseau.children[1].addEventListener('click', nextChoice)

var choixTaille = document.querySelector("#choixTailleDuPlateau")
var choixTemps = document.querySelector("#choixDuTemps")
var choixOrdre = document.querySelector("#choixQuiCommence")

var time = document.querySelector("#borderTime p")
var temps = 0
var champtourActu = document.querySelectorAll(".tourActu")


var startButton = document.querySelector('#start')
startButton.addEventListener('click', start)

var champPuissance4 = document.querySelector('#champPuissance4')
var allPlaces
var rows
var colums
var intervalTime
var nbJoueur
var joueurActu
var timer
var gameEnded = false
//#endregion

//#region startGame_Other
function choiceDifficultéSolo(){
    choixJoueur.style.display = 'none'
    choixDifficulté.style.display = 'flex'
    nbJoueur = 1
}

function choiceDifficultéMulti(){
    choixJoueur.style.display = 'none'
    choixReseau.style.display = 'flex'
    nbJoueur = 2
}

function nextChoice(){
    header.style.display = 'none'
    section.style.display = 'flex'
}

function start(){
    section.style.display = "none"
    article.style.display = 'flex'
    build()
    changeTime()

    if (nbJoueur == 1 && joueurActu == 1){
        setTimeout(playIA, 500)
    }
}


function build(){
    colums = choixTaille.options[choixTaille.selectedIndex].value.split('x')[0]
    rows = choixTaille.options[choixTaille.selectedIndex].value.split('x')[1]
    champPuissance4.style.gridTemplateColumns = 'repeat('+colums+', 1fr)'
    champPuissance4.style.gridTemplateRows = 'repeat('+rows+', 1fr)'

    timer = choixTemps.options[choixTemps.selectedIndex].value
    chooseOrder()

    champtourActu[joueurActu].innerHTML = "Ton tour"
    champtourActu[Math.abs(joueurActu-1)].innerHTML = ""
    
    for (var i = 0; i < rows; i++){
        for (var j = 0; j < colums; j++){
            var cercle = document.createElement('div')
            cercle.classList.add('cercle')
            cercle.id = i.toString()+j.toString()
            champPuissance4.appendChild(cercle)
        }

    }
    allPlaces = champPuissance4.querySelectorAll(":nth-child(1n)")
    allPlaces.forEach(e=>{
        e.addEventListener('mouseover', hover)
        e.addEventListener('mouseout', unhover)
        e.addEventListener('click', placePawn)
    })
    time.innerHTML = temps
}

function chooseOrder(){
    ordre = choixOrdre.options[choixOrdre.selectedIndex].value
    if (ordre == 'adversaire'){
        joueurActu = 1
    }else if (ordre == "je"){
        joueurActu = 0
    }else{
        joueurActu =  Math.floor(Math.random() * 2)
    }
}

function hover(){//PEUT FAIRE AVEC UN ALT A LA PLACE DE L'ID
    allPlaces.forEach(e=>{
        if (e.id.substring(1)==this.id.substring(1)){
            e.classList.add('hoverColumn')
        }else{
            e.classList.remove('hoverColumn')
        }
    })
    this.classList.add('hoverColumn')
}

function unhover(){
    allPlaces.forEach(e=>{
        if (e.id.substring(1)==this.id.substring(1)){
            e.classList.remove('hoverColumn')
        }
    })
}

function changeTime(){
    intervalTime = setInterval(()=>{
        temps++
        if (temps >=60){
            if (temps%60>=10){
                time.innerHTML = parseInt(temps/60)+" : "+temps%60
            }else{
                time.innerHTML = parseInt(temps/60)+" : 0"+temps%60
            }
        }else if(temps >=10){
            time.innerHTML = "0 : "+temps
        }else{
            time.innerHTML = "0 : 0"+temps
        }
    }, 1000)

}

setInterval(() =>{
    champtourActu[joueurActu].classList.toggle('tourActuInterval')
}, 500)

//#endregion

function placePawn(){
    if (gameEnded) return
    if (nbJoueur == 1 && joueurActu == 1) return
    playMove(this.id.substring(1))
}

function playMove(column){
    var idRows = rows
    var placed = false
    var pawnPlaced
    while (idRows >0 && !placed){
        var pawnActu = allPlaces[idRows*colums-(colums-column)]
        if (pawnActu.style.backgroundColor != "red" && pawnActu.style.backgroundColor != "yellow"){
            placed = true;
            pawnPlaced = pawnActu
            if (joueurActu == 0){
                pawnActu.style.backgroundColor = 'red'
            }else{
                pawnActu.style.backgroundColor = 'yellow'
            }
            joueurActu = Math.abs(joueurActu -1)
        }
        idRows--
        champtourActu[joueurActu].innerHTML = "Ton tour"
        champtourActu[Math.abs(joueurActu-1)].innerHTML = ""
    }
    if (!placed){
        console.log('La colonne est pleine')
    }
    if (checkVictory(pawnPlaced)){
        gameEnded = true
        if (Math.abs(joueurActu -1) == 0){
            alert("Le joueur rouge gagne")
        }else{
            alert("Le joueur jaune gagne")
        }
        isEnd()
        return
    }
        if (nbJoueur == 1 && joueurActu == 1){
        setTimeout(playIA, 500)
    }
}


function checkVictory(cell){
    var color = cell.style.backgroundColor

    var row = parseInt(cell.id[0])
    var column = parseInt(cell.id[1])

    var directions = [
        [1, 0],   // vertical
        [0, 1],   // horizontal
        [1, 1],   // diagonale \
        [1, -1]   // diagonale /
    ]

    for (var d = 0; d < directions.length; d++){

        var count = 1
        var dx = directions[d][0]
        var dy = directions[d][1]

        // sens positif
        var r = row + dx
        var c = column + dy

        while (r >= 0 && r < rows && c >= 0 && c < colums && getCell(r, c).style.backgroundColor == color){
            count++
            r += dx
            c += dy
        }

        // sens négatif
        r = row - dx
        c = column - dy

        while (r >= 0 && r < rows && c >= 0 && c < colums && getCell(r, c).style.backgroundColor == color){
            count++
            r -= dx
            c -= dy
        }
        if (count >= 4) return true
    }

    return false
}

function getCell(row, column){
    return document.getElementById(row.toString() + column.toString())
}


//#region IA
function playIA(){

    if (gameEnded){
        return
    }

    var playableColumns = []

    for (var c = 0; c < colums; c++){

        if (columnPlayable(c)){
            playableColumns.push(c)
        }
    }

    // essayer de gagner
    for (var i = 0; i < playableColumns.length; i++){

        var column = playableColumns[i]

        var cell = simulateMove(column, "yellow")

        if (cell){

            if (checkVictory(cell)){

                cell.style.backgroundColor = ""
                playMove(column)
                return
            }

            cell.style.backgroundColor = ""
        }
    }

    // essayer de bloquer le joueur
    for (var i = 0; i < playableColumns.length; i++){

        var column = playableColumns[i]

        var cell = simulateMove(column, "red")

        if (cell){

            if (checkVictory(cell)){

                cell.style.backgroundColor = ""
                playMove(column)
                return
            }

            cell.style.backgroundColor = ""
        }
    }

    // sinon coup random
    var randomColumn =
        playableColumns[Math.floor(Math.random() * playableColumns.length)]

    playMove(randomColumn)
}

function columnPlayable(column){

    for (var r = rows - 1; r >= 0; r--){

        var cell = getCell(r, column)

        if (
            cell.style.backgroundColor != "red" &&
            cell.style.backgroundColor != "yellow"
        ){
            return true
        }
    }

    return false
}

function simulateMove(column, color){

    for (var r = rows - 1; r >= 0; r--){

        var cell = getCell(r, column)

        if (
            cell.style.backgroundColor != "red" &&
            cell.style.backgroundColor != "yellow"
        ){

            cell.style.backgroundColor = color
            return cell
        }
    }

    return null
}

//#endregion

function isEnd(){
    clearInterval(intervalTime)

}