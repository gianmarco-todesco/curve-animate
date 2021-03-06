// gian marco todesco - gianmarco.todesco@gmail.com
// Lezione "Curve Animate", 15 gennaio 2020

/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */

'use strict'

const canvas = document.getElementById('c')
const ctx = canvas.getContext('2d')
let width, height

// ciclo principale: cancella il canvas e disegna il nuovo fotogramma
function mainLoop () {
    width = canvas.width
    height = canvas.height
    ctx.clearRect(0,0,width,height)
    ctx.save()
    ctx.translate(width/2, height/2)
    draw()
    ctx.restore()
    requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop)

// --------------------------------------------------------
// parametri
// --------------------------------------------------------

// velocità di rotazione del primo epiciclo
let omega = 0.3

let maxTailLength = 1000

// --------------------------------------------------------
// variabili
// --------------------------------------------------------

// traccia lasciata dal punto blu
let tail = []

// curva disegnata dall'utente
let targetCrv = []

// modalita': se stroking vale true allora l'utente sta disegnando
let stroking = false

// dft = Discrete Fourier Transform
const dft = {
    center: {},
    items: []
}

// centro e raggio dei vari epicicli
let circles = []

// --------------------------------------------------------
// gestione click&drag del mouse
// --------------------------------------------------------
let offx = 0
let offy = 0
function onMouseDown (e) {
    // l'utente ha fatto click nel canvas.
    // comincio a seguire globalmente gli eventi di mouse-move e mouse-up
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', onRelease)
    // mi ricordo la differenza fra coordinate rispetto al canvas (offsetX,offsetY)
    // e rispetto al documento (e.clientX, e.clientY)
    offx = e.offsetX - e.clientX
    offy = e.offsetY - e.clientY
    // informo il programma che l'utente ha cominciato a disegnare
    strokeStart()
}
function onDrag (e) {
    // il mouse si è mosso (dopo il click)
    // calcolo le coordinate del mouse rispetto al centro del canvas
    var x = e.clientX + offx - canvas.width/2 
    var y = e.clientY + offy - canvas.height/2
    // informo il programma che l'utente ha prolungato il disegno fino al punto (x,y)
    stroke(x, y)
}
function onRelease (e) {
    // l'utente ha finito di disegnare. smetto di seguire mouse-move e mouse-up
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', onRelease)
    // informo il programma che il disegno è finito
    strokeEnd()
}
// tutte le volte che l'utente fa click nel canvas chiamo la funzione onMouseDown
canvas.addEventListener('mousedown', onMouseDown)

// l'utente ha cominciato a tracciare una curva
function strokeStart () {
    // cancello le curve precedenti
    tail = []
    targetCrv = []
    // cambio lo stato del programa
    stroking = true
}
// l'utente ha disegnato un pezzetto di curva
function stroke (x, y) {
    // aggiungo il punto (x,y) a targetCrv solo se non è troppo vicino all'ultimo
    // punto disegnato
    const m = targetCrv.length
    if (m > 0) {
        const lastPoint = targetCrv[m - 1]
        const dx = lastPoint[0] - x
        const dy = lastPoint[1] - y
        if (dx * dx + dy * dy < 50) return
    }
    targetCrv.push([x, y])
}
// l'utente ha finito di disegnare: calcolo la DFT (se la curva disegnata è abbastanza lunga)
function strokeEnd () {
    if (targetCrv.length > 10) {
        computeDft(targetCrv)
    } else {
        targetCrv = []
    }
    stroking = false
}

// --------------------------------------------------------
// Questa funzione calcola la DFT a partire da una lista di
// punti (x,y)
// --------------------------------------------------------
function computeDft (crv) {
    const n = crv.length
    const d = Math.floor(n / 2)
    dft.items = []
    for (let k = -d; k < -d + n; k++) {
        const phi = 2 * Math.PI * k / n
        let re = 0
        let im = 0
        for (let j = 0; j < n; j++) {
            const re1 = crv[j][0]
            const im1 = crv[j][1]
            const re2 = Math.cos(phi * j)
            const im2 = -Math.sin(phi * j)
            var re3 = re1 * re2 - im1 * im2
            var im3 = re1 * im2 + re2 * im1
            re += re3
            im += im3
        }
        re /= n
        im /= n
        if (k == 0) {
            dft.center = { re, im }
        } else {
            dft.items.push({ re, im, k, norm: Math.sqrt(re * re + im * im) })
        }
    }
    dft.items.sort((a, b) => b.norm - a.norm)
}

// --------------------------------------------------------
// Funzione principale di disegno
// --------------------------------------------------------
function draw () {
    // se è presente disegno la curva inserita dall'utente
    if (targetCrv.length > 2) {
        ctx.strokeStyle = 'cyan'
        ctx.lineWidth = 5
        drawCurve(targetCrv)
    }

    // calcolo e disegno gli epicicli se l'utente non sta disegnando ed è
    // stata calcolata una DFT
    if (!stroking && dft.items.length > 0) {
        computeEpicycles()
        drawEpicycles()
    }

    // disegno la traccia blu se c'è
    if (tail.length > 2) {
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = 2
        drawCurve(tail)
    }
}

// --------------------------------------------------------
// Calcola la posizione e il raggio degli epicicli
// --------------------------------------------------------
function computeEpicycles () {
    circles = []
    if (dft.items.length == 0) return
    let x = dft.center.re
    let y = dft.center.im

    // tempo in secondi dall'inizio
    const time = performance.now() * 0.001
    var phi = omega * time
    const n = dft.items.length + 1 // il +1 deriva da dft.center con k=0
    for (let i = 0; i < n - 1; i++) {
        // aggiungo il cerchio i-esimo
        circles.push({ x, y, r: dft.items[i].norm })
        // calcolo le coordinate del centro del cerchio successivo
        const re1 = dft.items[i].re
        const im1 = dft.items[i].im
        const k = dft.items[i].k
        const re2 = Math.cos(phi * k)
        const im2 = Math.sin(phi * k)
        var dx = re1 * re2 - im1 * im2
        var dy = re1 * im2 + re2 * im1
        x += dx
        y += dy
    }
    addPointToTail(x, y)
}

// --------------------------------------------------------
// Disegno gli epicicli
// --------------------------------------------------------
function drawEpicycles () {
    if (circles.length == 0) return
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgb(200,200,200,0.5)'
    const r1 = 3
    circles.forEach((circle, i) => {
        const { x, y, r } = circle
        const opacity = 1.0 / (1 + i * 0.25)
        ctx.strokeStyle = 'rgb(100,100,100,' + opacity + ')'
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.moveTo(x + r1, y)
        ctx.arc(x, y, r1, 0, 2 * Math.PI)
        if (i > 0) {
            ctx.moveTo(x, y)
            ctx.lineTo(circles[i-1].x, circles[i-1].y)
        }
        ctx.stroke()
    })
}

// --------------------------------------------------------
// gestione riga blu
// --------------------------------------------------------

// aggiunge un punto alla traccia
// se necessario cancella i punti più vecchi
function addPointToTail (x, y) {
    tail.push([x, y])
    if (tail.length > maxTailLength) {
        tail.splice(0, tail.length - maxTailLength)
    }
}
// disegno una curva
function drawCurve (crv) {
    var n = crv.length
    if (n < 2) return
    ctx.beginPath()
    ctx.moveTo(crv[0][0], crv[0][1])
    for (let i = 1; i < n; i++) ctx.lineTo(crv[i][0], crv[i][1])
    ctx.stroke()
}
