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

//ASSETS
let shakeSound





//CLASSI

//definisco la classe che corrisponderà al mio player e alle palline in giro per lo schermo
class colorBall{
	constructor(x, y, r, c) {
	//definisco la posizione con un vettore
	this.pos = new p5.Vector(x, y);
	this.r = r;
	this.c= c;
	}
  
	update() {
		//definisco due variabili associate alla rtoazione dello schermo
		let rX= constrain(rotationY,-30,30)
		let rY= constrain(rotationX,-30,30)

		//rimappo il valore delle variabili in modo che assuma un valore compreso tra -5 e 5
		let dX= map(rX,-30, 30,-5, 5);
		let dY= map(rY,-30, 30,-5, 5);
		
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
	setShakeThreshold(30)

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

	//ALERT COMPUTER
	else if (mode== 2){
		clear()

		cnv= createCanvas(windowWidth, windowHeight);
		background("black")
		
		computerAlert()
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
		player.update();
		
		//faccio comparire le palline generate nel setup
		for (var i = colorBalls.length - 1; i >= 0; i--) {
			colorBalls[i].show();
		
			if (player.eats(colorBalls[i])) {
				colorBalls.splice(i, 1);
			}

			//se le palline diventano meno di 80 allora viene creata un'altra pallina
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

		//impongo al player di non poter ai confini del mondo che ho definito
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
		worldbounds= rect(-width*4,-height*4, width*8, height*8)
		
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
	container= createDiv()
	container.style("width:100%; height: 70px;")
	container.center()
	
	 instruction1= createP("tap the screen to start")
	 instruction2= createP("rotate to draw")
	 instruction3= createP("shake to save your work")

	 instruction1.parent(container)
	 instruction2.parent(container)
	 instruction3.parent(container)

	 if (windowWidth > 1000 && windowHeight > 500){

		container.position(0, windowHeight*12.5/18)
		container.style("height: 100px;")
		instruction1.style('font-size', '20px')
		instruction2.style('font-size', '20px')
		instruction3.style('font-size', '20px')

	} else 

	//posizione dei p per lo schermo in verticale
	if (windowWidth<windowHeight){
		container.position(0, windowHeight*12/18)

	//posizione dei p per lo schermo in orizzontale
	} else if (windowWidth>windowHeight) {
		container.position(0, windowHeight*13.5/18)
		container.style("height: 50px;")
	}
	pop()
}


//START GAME
function touchStarted(){
	
	// messaggio di alert se si gioca da computer
	if (windowWidth > 1000 && windowHeight > 500){
		mode=2
	} else
		mode=1
		paragraphs = selectAll("p")
		paragraphs.forEach(function(p){
			p.hide()})

		containers = selectAll("div")
		containers.forEach(function(d){
			d.hide()})
}


//COMPUTER ALERT
function computerAlert(){
	push()
	container2= createDiv()
	container2.style("width:100%; height: 150px;")
	container2.center()

	alert1 = createP("Oh no! :(")
	alert2 = createP("Seems you are trying to access the game from your computer.")
	alert3 = createP("Open the link from your phone to play!")

	container2.position(0, windowHeight*7/18)

	alert1.parent(container2)
	alert1.style('font-size:40px; margin-bottom:20px;')

	alert2.parent(container2)
	alert3.parent(container2)
	alert2.style('font-size', '20px')
	alert3.style('font-size', '20px')
	pop()
}



//SAVE IMAGE
function deviceShaken() {
	let artwork= createImage(width*2,height*2)
	artwork.save("draw", 'png')
}




// REFERENCE

//https://thecodingtrain.com/challenges/32-agario - Agar.io, Daniel Shiffman
//https://thecodingtrain.com/challenges/59-steering-behaviors - Steering Behaviors, Daniel Shiffman
//https://www.youtube.com/watch?v=AbB9ayaffTc&list=PLG5HuBbpokzX3bgbBjlt4GE_C5HF3t0dr&index=65&ab_channel=designersdocode - Device Motion, designersdocode
//https://www.youtube.com/watch?v=TgHhEzKlLb4&ab_channel=MagicMonk - Start Menu, Magic Monk