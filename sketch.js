//VARIABILI

//variabile che mi fa passare dalla schermata iniziale a quella di gioco
let mode

let cnv

//LANDING PAGE
let container
let instruction1
let	instruction2
let	instruction3
let paragraphs = []
//scritta palline
let pointsDr = []
let pointsAr = []


//COMPUTER ALERT
let container2
let alert1
let alert2
let alert3


//SCHERMATA DI GIOCO
let worldbounds
let xB
let yB
//palline colorate
let ballColor
let rdmX
let rdmY
let colorBalls = []
//player
let player
let point
let trail = []





//CLASSI

//definisco la classe che corrisponderà al mio player e alle palline in giro per lo schermo
class colorBall{
	constructor(x, y, r, c) {
	//definisco la posizione con un vettore
	this.pos = new p5.Vector(x, y);
	this.r = r;
	this.c= c;
	}
  
	updatePhone() {
		//definisco due variabili associate alla rotazione dello schermo
		let rX= constrain(rotationY,-30,30)
		let rY= constrain(rotationX,-60,60)

		//rimappo il valore delle variabili in modo che assuma un valore compreso tra -6 e +6
		let dX= map(rX,-30, 30,-6, 6);
		let dY= map(rY,-60, 60,-6, 6);
		
		//genero un vettore con questi nuovi valori
		let dir = createVector(dX, dY);
		//lo sommo al vettore posizione associato al player
		this.pos.add(dir);
	}
  
	updateDesktop(){	
	//definisco due variabili associate alla posizione del mouse
	let dX= map(mouseX,0, width,-10, +10);
	let dY= map(mouseY,0, height,-10, +10);
	
	//genero un vettore con questi nuovi valori
	let dir = createVector(dX, dY);
	//lo sommo al vettore posizione associato al player
	this.pos.add(dir);
	}
	
	//metodo che fa interagire il player con le altre palline nella canvas
	eats(other) {
		//definisco una variabile corrispondente alla distanza tra i due cerchi
	  let d = p5.Vector.dist(this.pos, other.pos);
		//se la distanza è minore della somma dei due raggi (ossia si toccano)
	  if (d < this.r /2 + other.r/2) {

		//sommo le aree delle due circonferenze
		var sum = PI * this.r * this.r + PI * other.r * other.r;
		//assegno al nuovo cerchio la dimensioe del raggio della circonferenza risultante dalla somma delle due aree
		this.r = sqrt(sum / PI);

		this.c= other.c
		
		return true;
	  } else {
		return false;
	  }
	}

	show() {
		fill(this.c);
		ellipse(this.pos.x, this.pos.y, this.r, this.r );
	  }
  }
 




//FUNZIONI

function preload(){
	font = loadFont('assets/fonts/Roboto/Roboto-Medium.ttf')
}


function setup() {
	mode= 0;
	cnv= createCanvas(windowWidth, windowHeight);
	ellipseMode(CENTER);
	setShakeThreshold(40)

	//creo le palline
	for (var i = 0; i < 200; i++) {

		R= random(0,255)
		G= random(0,255)
		B= random(0,255)
		ballColor= color(R,G,B)

		rdmX= random(-width*4, width*4)
		rdmY= random(-height*4, height*4)
		
		colorBalls[i] = new colorBall(rdmX, rdmY, floor(random(10, 40)), ballColor);
	}
	
	//creo il player
	player = new colorBall(0, 0, 20, "white");

}



function draw() {
	clear()

	//LANDING PAGE
	if (mode== 0){

		cnv= createCanvas(windowWidth, windowHeight);
		background("black")
		
		gameTitle()
		gameInstructions()
	}

	//SCHERMATA DI GIOCO
	else if(mode== 1){ 
		
		frameRate(60)

		//ricreo la canvas nel draw per ricreare il disegno al cambiare dell'oreintamento dello schermo 
		cnv= createCanvas(windowWidth, windowHeight);
		background("black")

		//applico questa trasformazione basata sulla posizione del player a tutti gli elementi
		translate(width / 2, height / 2);
		translate(-player.pos.x, -player.pos.y);

		//definisco le dimensione del mondo in cui verranno create le palline e in cui si muoverà il player
		xB= width*4^2
		yB= height*4^2

		//creo il player
		player.show();

		if (windowWidth > 1000 && windowHeight > 500){
			player.updateDesktop();
		} else 

		player.updatePhone();
		
		//faccio comparire le palline generate nel setup
		for (var i = colorBalls.length - 1; i >= 0; i--) {
			colorBalls[i].show();
		
			if (player.eats(colorBalls[i])) {
				colorBalls.splice(i, 1);
			}

			//quando le palline diventano 80 ne viene creata un'altra
			if (colorBalls.length== 80){
				R= random(0,255)
				G= random(0,255)
				B= random(0,255)
				ballColor= color(R,G,B)

				noStroke()

				rdmX= random(-xB, xB)
				rdmY= random(-yB, yB)

				colorBalls.push(new colorBall(rdmX, rdmY, floor(random(10, 40)), ballColor));
			}
		}

		//creo un oggetto contenente posizione, colore e raggio del player per tracciarne la scia
		point = {
			x: player.pos.x,
			y: player.pos.y,
			r: player.r,
			c: player.c
		}
		//salvo i valori in un array
		trail.push(point);

		//disegno degli ellissi che hanno i valori associati all'array points
		for (var i = 0; i< trail.length; i ++) {
				
			noStroke()
			fill(trail[i].c)
			ellipse(trail[i].x, trail[i].y, trail[i].r)
		}

			//oltre gli 800 elementi cancello il primo ellisse dell'array
			if (trail.length >= 800) {
				trail.shift()
			}
		}

		//impongo al player di non poter superare i confini del mondo che ho definito
		if ( player.pos.x <= -(xB - player.r/2) ) {
			player.pos.x= -(xB - player.r/2)
		} else if ( player.pos.x >= (xB - player.r/2) ) {
			player.pos.x= (xB - player.r/2)
		} else if ( player.pos.y <= -(yB - player.r/2) ) {
			player.pos.y= -(yB - player.r/2)
		} else if ( player.pos.y >= (yB - player.r/2) ) {
			player.pos.y= (yB - player.r/2)
		}

		//creo il rettangolo che rappresenta i confini del mondo
		push()

		noFill()
		strokeWeight(10)
		stroke(255)
		worldbounds= rect(-xB,-yB, width*8, height*8)
		
		pop()
		
}	
  

//LANDING PAGE 
function gameTitle(){
	push()
	
	frameRate(3)

	//definisco una dimensione degli elementi per lo schermo del computer
	if (windowWidth > 1000 && windowHeight > 500){
		pointsDr = font.textToPoints('DRAWING', windowWidth*2/8, windowHeight*7/18, 160);
		pointsAr = font.textToPoints('ARENA',  windowWidth*2.5/8, windowHeight*11/18, 160 );

	} else 

	//definisco le dimensione degli elementi per il telefono
	
	//verticale
	if(windowWidth<windowHeight){
		pointsDr = font.textToPoints('DRAWING', windowWidth/24, windowHeight*8/18, 85);
		pointsAr = font.textToPoints('ARENA',  windowWidth/6, windowHeight*10/18, 85 );

	//orizzontale
	} else if (windowWidth>windowHeight) {
		pointsDr = font.textToPoints('DRAWING', windowWidth/6, windowHeight*2/6, 120);
		pointsAr = font.textToPoints('ARENA', windowWidth/4, windowHeight*4/6, 120 );
	}
	
	//disegno una serie di ellissi per ciascun punto dei due array corrispondenti ai due testi
	for (let i = 0; i < pointsDr.length; i++) {
		let pt = pointsDr[i];
		
		let r= random(2,8)
		noStroke()
		
		R= random(0,255)
		G= random(0,255)
		B= random(0,255)
		let rdmColor= color(R,G,B)

		fill(rdmColor)
		ellipse(pt.x, pt.y, r);
	}

	for (let i = 0; i < pointsAr.length; i++) {
		let pt = pointsAr[i];
		let r= random(2,8)
		noStroke()
		
		R= random(0,255)
		G= random(0,255)
		B= random(0,255)
		let rdmColor= color(R,G,B)

		fill(rdmColor)
		ellipse(pt.x, pt.y, r);
	}

	pop()
}


function gameInstructions(){
	push()
	//definisco un div centrale rispetto allo schermo in cui inserisco i tre paragrafi di istruzione
	container= createDiv()
	container.style("width:100%; height: 70px;")
	container.center()
	
	 instruction1= createP("tap the screen to start")
	 instruction2= createP("rotate to draw")
	 instruction3= createP("shake to save your work")

	 instruction1.parent(container)
	 instruction2.parent(container)
	 instruction3.parent(container)

	 //definisco le posizioni e le dimensioni del testo per il computer
	 if (windowWidth > 1000 && windowHeight > 500){

		container.position(0, windowHeight*12.5/18)
		container.style("height: 100px;")
		instruction1.style('font-size', '20px')
		instruction2.hide()
		instruction3.hide()

	} else 

	//definisco la posizione del div per il telefono
	//se lo schermo è in verticale
	if (windowWidth<windowHeight){
		container.position(0, windowHeight*12/18)

	//se lo schermo è in orizzontale
	} else if (windowWidth>windowHeight) {
		container.position(0, windowHeight*13.5/18)
		container.style("height: 50px;")
	}
	pop()
}


//START GAME
function touchStarted(){

		paragraphs = selectAll("p")
		paragraphs.forEach(function(p){
			p.hide()})

		containers = selectAll("div")
		containers.forEach(function(d){
			d.hide()})
		
		mode=1 
}


//SAVE IMAGE
function deviceShaken() {
	let artwork= createImage(width*2,height*2)
	artwork.save("draw", 'png')
}

function keyPressed() {
	if  (keyCode === 32){ // spacebar
	let artwork= createImage(width*2,height*2)
	artwork.save("draw", 'png')
	}
}





// REFERENCE

//https://thecodingtrain.com/challenges/32-agario - Agar.io, Daniel Shiffman
//https://thecodingtrain.com/challenges/59-steering-behaviors - Steering Behaviors, Daniel Shiffman
//https://www.youtube.com/watch?v=AbB9ayaffTc&list=PLG5HuBbpokzX3bgbBjlt4GE_C5HF3t0dr&index=65&ab_channel=designersdocode - Device Motion, designersdocode
//https://www.youtube.com/watch?v=TgHhEzKlLb4&ab_channel=MagicMonk - Start Menu, Magic Monk


