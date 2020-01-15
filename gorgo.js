// gian marco todesco - gianmarco.todesco@gmail.com
// Lezione "Curve Animate", 15 gennaio 2020

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let width, height;
let mousex, mousey,mousein=false;

// voglio essere avvertito quando il mouse si muove sul canvas
canvas.addEventListener('mousemove', e=>{
    // (mousex, mousey) contengono le coordinate dell'ultima
    // posizione del mouse rispetto al canvas
    mousex=e.offsetX - width/2;
    mousey=e.offsetY - width/2;
    // mousein vale true se il mouse è dentro la finestra
    mousein = true;
});
// voglio essere avvertito quando il mouse esce dal canvas
canvas.addEventListener('mouseleave',e=> { mousein = false;});

// ciclo principale (cancello e disegno)
function mainLoop() {
    width = canvas.width;
    height = canvas.height;
    ctx.clearRect(0,0,width,height);
    // sposto l'origine delle cordinate al centro del canvas
    ctx.save();
    ctx.translate(width/2,height/2); 
    draw();
    // ristabilisco l'origine delle cordinate al valore standard
    ctx.restore();
    requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);

// parametri della deformazione
var m = 10;  // numero di righe e colonne
var radius = 150; // larghezza dell'effetto
var angle = Math.PI/2; // angolo massimo di rotazione (radianti)

// funzione principale di disegno
function draw() {
    // calcola l'ampiezza della griglia (rispetto alle dimensioni del canvas)
    const r = height * 0.9 * 0.5;
    // disegna la griglia
    for(var i=0; i<m; i++) {
        var c = -r + 2*r*i/(m-1);
        drawDeformedLine(-r,c,r,c);
        drawDeformedLine(c,-r,c,r);        
    }
    // se il mouse è dentro il canvas, evidenziane la posizione
    // con un puntino rosso
    if(mousein) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(mousex,mousey,5,0,Math.PI*2);
        ctx.fill();    
    }
}

// disegna una linea deformata da (x0,y0) a (x1,y1)  
function drawDeformedLine(x0,y0, x1,y1) {
    const n = 100;
    ctx.beginPath();
    var p = deform(x0,y0);
    ctx.moveTo(p[0],p[1]);
    for(var i=1;i<=n;i++) {
        const t = i/n;
        p = deform(x0*(1-t)+x1*t,y0*(1-t)+y1*t);
        ctx.lineTo(p[0],p[1]);
    }
    ctx.stroke();    
}

// questa funzione definisce la deformazione 
function deform(x,y) {
    // se il mouse è fuori dal canvas non c'è deformazione:
    // la funzione restituisce i suoi argomenti
    if(!mousein) 
        return [x,y];
    
    // x1,y1 sono le coordinate rispetto alla posizione 
    // corrente del mouse
    let x1 = x-mousex;
    let y1 = y-mousey;

    // calcolo il quadrato della distanza con il mouse
    let r2 = x1*x1+y1*y1;
    // .. e l'angolo usando una gaussiana
    let phi = 0.5*Math.PI*Math.exp(-r2/(radius*radius));
    
    // ruoto (x1,y1) di un angolo phi => (x2,y2)
    const cs = Math.cos(phi), sn = Math.sin(phi);
    let x2 = x1*cs - y1*sn;
    let y2 = x1*sn + y1*cs;

    // torno nel sistema di riferimento del canvas
    return [ mousex + x2, mousey + y2]    
}

