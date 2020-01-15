// gian marco todesco - gianmarco.todesco@gmail.com
// Lezione "Curve Animate", 15 gennaio 2020

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let width, height;

// ciclo principale: cancella il canvas e disegna il nuovo fotogramma
function mainLoop() {
    width = canvas.width;
    height = canvas.height;
    ctx.clearRect(0,0,width,height);
    ctx.save();
    ctx.translate(width/2,height/2);
    draw();
    ctx.restore();
    requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);

// parametri
let r1 = 100; // raggio primo cerchio
let r2 = 40; // raggio secondo cerchio
let r3 = 40; // distanza del punto blu dal centro del secondo cerchio

let omega = 0.6; // velocità del secondo cerchio (radianti/secondo)

let maxCurveLength = 200; // max n. di punti che formano la traccia rossa

// curve è un array che conterrà i punti successivi della
// traiettoria disegnata dal punto blu
curve = [];

// disegno 
function draw() {
    // numero di secondi dall'inizio del programma
    const time = performance.now() * 0.001;

    // phi1 controlla la rotazione del secondo cerchio
    // attorno al primo. Dipende solo dal tempo
    let phi1 = time * omega;

    // phi2 è la rotazione del secondo cerchio rispetto
    // agli assi. dipende da phi1 e dal rapporto fra le 
    // grandezze dei due cerchi
    let phi2 = phi1 + phi1 * r1/r2;

    // calcolo le coordinate del centro del secondo cerchio
    let x1 = Math.cos(phi1)*(r1+r2);
    let y1 = Math.sin(phi1)*(r1+r2);
    
    // .. e del punto blu
    let x2 = x1 + Math.cos(phi2)*r3;
    let y2 = y1 + Math.sin(phi2)*r3;
    
    // disegno i due cerchi
    ctx.fillStyle = "rgb(200,200,200)";
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    fillCircle(0,0,r1);
    fillCircle(x1,y1,r2);

    // e i segmenti che collegano i tre punti 
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();

    // disegno il punto blu
    ctx.fillStyle = "blue";
    fillCircle(x2,y2,3);

    // aggiungo il punto blu alla traccia rossa
    curve.push([x2,y2]);

    // e cancello i punti più vecchi se serve
    if(curve.length>maxCurveLength) 
        curve.splice(0,curve.length-maxCurveLength);
    
    // disegno la traccia rossa
    if(curve.length>2) {
        ctx.beginPath();
        ctx.moveTo(curve[0][0], curve[0][1]);
        for(let i=1; i<curve.length; i++) 
            ctx.lineTo(curve[i][0], curve[i][1]);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();
    }    
}


// disegna un disco 
function fillCircle(x,y,r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
}
