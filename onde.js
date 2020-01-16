// gian marco todesco - gianmarco.todesco@gmail.com
// Lezione "Curve Animate", 15 gennaio 2020

'use strict'

const canvas = document.getElementById('c')
const ctx = canvas.getContext('2d')
let width, height

function mainLoop () {
    width = canvas.width
    height = canvas.height
    ctx.clearRect(0, 0, width, height)
    draw()
    requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop)

function drawGraph (f) {
    const x0 = 50
    const x1 = width - x0
    const n = 1000
    ctx.beginPath()
    ctx.moveTo(x0, f(0) + height / 2)
    for (let i = 1; i <= n; i++) {
        const t = i / n
        const x = x0 + (x1 - x0) * t
        ctx.lineTo(x, f(t) + height / 2)
    }
    ctx.stroke()
}

function draw () {
    const time = performance.now() * 0.001
    ctx.lineWidth = 3
    for (var i = 0; i < 15; i++) {
        const factor = (i * 0.05 + 1) * 2
        ctx.strokeStyle = 'rgb(255,' + 127 * i / 15 + ',127)'
        drawGraph(t => Math.sin(Math.PI * 2 * t + factor * time) * (100 - i * 2))
    }
}
