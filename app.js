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
}


function build(){
    colums = choixTaille.options[choixTaille.selectedIndex].value.split('x')[0]
    rows = choixTaille.options[choixTaille.selectedIndex].value.split('x')[1]
    champPuissance4.style.gridTemplateColumns = 'repeat('+colums+', 1fr)'
    champPuissance4.style.gridTemplateRows = 'repeat('+rows+', 1fr)'

    timer = choixTemps.options[choixTemps.selectedIndex].value
    chooseOrder()
    console.log(champtourActu)
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
    var idRows = rows
    var idColumns = colums
    var placed = false
    while (idRows >0 && !placed){
        var pawnActu = allPlaces[idRows*colums-(colums-this.id.substring(1))]
        if (pawnActu.style.backgroundColor != "red" && pawnActu.style.backgroundColor != "yellow"){
            placed = true;
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
}

function isEnd(){
    clearInterval(intervalTime)

}

//9X8 == 80% (widht, height)
