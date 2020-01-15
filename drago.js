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
    draw();
    requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);


// parametri dell'animazione:

// l'intero ciclo animato richiede 'period' secondi
let period = 10; 

// massima iterazione (l'iterazione 0 è il semplice segmento)
let maxLevel = 15;


// disegna il nuovo fotogramma
function draw() {
    // calcolo la posizione degli estremi : (x0,y), (x1,y)
    var x0 = width*0.25;
    var x1 = width-x0;
    var y = height/2;

    // parametro cambia linearmente con il tempo, avanti e indietro da 0 a 1    
    var parametro = performance.now() * 0.001 / period;
    parametro = 2.0*(parametro - Math.floor(parametro)); // da 0 a 2
    if(parametro>1) parametro = 2-parametro; // da 0 a 1 e da 1 a 0

    // il livello ha una parte intera e una parte decimale
    // quest'ultima serve per controllare una transizione continua
    // fra un livello e il successivo
    let level = parametro * (maxLevel+1);
    let intLevel = Math.floor(level);

    drago(x0,y,x1,y,intLevel, level - intLevel);
}

// funzione ricorsiva che disegna la curva del drago
function drago(x0,y0,x1,y1,level, t) {
    if(level==0) {
        // a livello zero disegna una semplice linea
        ctx.beginPath();
        ctx.moveTo(x0,y0);
        ctx.lineTo(x1,y1);
        ctx.stroke();
    }
    else
    {
        // altrimenti disegno due curve di livello inferiore
        // il parametro s controlla l'interpolazione continua
        // fra un livello e il successivo. Vale t solo per 
        // il penultimo livello, altrimenti è bloccata ad 1
        let s = level>1 ? 1 : t;

        // calcolo il punto medio fra (x0,y0) e (x1,y1)
        let xm = (x0+x1)/2;
        let ym = (y0+y1)/2;
        // il punto (x2,y2) deve essere il vertice di un quadrato
        // che ha (x0,y0)-(x1,y1) come diagonale
        let dx = xm-x0;
        let dy = ym-y0;
        let x2 = xm-dy*s, y2 = ym+dx*s;
        // disegno le due curve di livello inferiore
        drago(x0,y0,x2,y2,level-1,t);
        drago(x1,y1,x2,y2,level-1,t);
    }
}
