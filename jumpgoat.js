//Inilize the variables
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
//goat
let goatWidth = 34;//width/heiht ratio = 408/228 = 17/12
let goatHeight = 24;
let goatX = boardWidth/8;
let goatY = boardHeight/2;
let goatImg;

let goat ={
    x : goatX,
    y : goatY,

    width : goatWidth,
    height : goatHeight
}
//pipes
let pipeArray =[];
let pipeWidth =64;//width/height ratio =384/3072 =1/8
let pipeHeight =512;
let pipeX =boardWidth;
let pipeY =0;


let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;//so this is the pipes moving left speed
let velocityY = 0;//goat JUMING SPEED
let gravity = 0.4;

let gameOver = false;

let score = 0;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board



    //draw goat messi pic 
    //context.fillStyle = "green";
    context.fillRect(goat.x,goat.y,goat.width,goat.height);



    //load img goat 
    goatImg =new Image();
    goatImg.src ="./GOAT.png";
    goatImg.onload = function(){

        context.drawImage(goatImg,goat.x,goat.y,goat.width,goat.height);
    }
      topPipeImg = new Image();
      topPipeImg.src="./toppipe.png";

      bottomPipeImg = new Image();
      bottomPipeImg.src="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes,1500);//every 1.5 sec
    document.addEventListener("keydown", moveGoat);
}

function update() {
   requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
   context.clearRect(0, 0, board.width,board.height);

   //goat
   velocityY += gravity;
   //goat.y += velocityY;
   goat.y = Math.max(goat.y + velocityY, 0); //this goona apply gravity to curretnt goat.y or this goona make sure it doesnt go up pass the canvas
   context.drawImage(goatImg,goat.x,goat.y,goat.width,goat.height);
  
   if (goat.y > board.height) {
    gameOver = true;
   }

   //pipes
   for (let i = 0; i < pipeArray.length; i++){
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);


    if(!pipe.passed && goat.x > pipe.x + pipe.width){
        score += 0.5; //score yei hisab lay badxa 0.5 vanesi two pipes vayera 1 ko aadar ma badaxa 
        pipe.passed =true;

    }
    
    if (detectCollision(goat, pipe)) {
        gameOver = true;
    }
   }
   //clear pipes
   while (pipeArray.length >0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //this removes the 1st elements from the array 
   }

   //score
   context.fillStyle = "white";
   context.font = "45px sans-serif";
   context.fillText(score, 5 , 45);

   if (gameOver) {
    context.fillText("GAME OVER", 5 , 90);
   }
}

function placePipes(){
       if (gameOver) {
        return;
       }

    //mtah .random returns the vaule between 0-1 and multiplying this by pipe heghit divided by 2
    //so if random returns zero we are going to have our y position be -128 which is basically pipe height divide by 4
    //and if math.random reurn 1 this is going to be 128 minus 256 because pipe height is 512 and 512 divided by 2 is 256 so this is (pipeheight /4 to pipeheight/2)=-3/4 pipe height
   let randomPipeY =pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); 

   let openingSpace = board.height/4;


    let topPipe ={
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false

    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);

}

function moveGoat(e) {
    if(e.code =="Space"|| e.code == "ArrowUp" || e.code =="KeyX"){
        //jump
        velocityY = -6;
        //reset game 
        if (gameOver) {
            goat.y =birdY;
            pipeArray =[];
            score =0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;

}