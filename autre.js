var imgJetons = document.querySelectorAll('#circles img')
var puissance4 = document.querySelectorAll('#titre h1 span')

puissance4.forEach(e=>{
    e.addEventListener('click', changeColorTexte)
})

function changeColorTexte(){
    this.classList.toggle('textRouge')
}

imgJetons.forEach(e=>{
    e.addEventListener('click', changeColor)
})

function changeColor(){
    if (this.src == "http://127.0.0.1:5500/img/jetonsJaune.png"){
        this.src = "http://127.0.0.1:5500/img/jetonsRouge.png"
    }else{
        this.src = "http://127.0.0.1:5500/img/jetonsJaune.png"
    }
}