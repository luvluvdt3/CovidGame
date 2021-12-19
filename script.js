   
   // Import the functions you need from the SDKs you need
   
   let cats, time, player,boundX, boundY;
   let numSaved= 0;
   let diameter=75;
   let restartBtn, resFinalString="", gameOver =false;
   let playerI, catI, catInDangerI, championS;
   let highScore=0, champion="",isNewRecord="false", database ;
   function preload() {
     playerI=loadImage('https://cdn.glitch.me/f44b3a75-5142-4137-ab78-df8f3d202ffc%2Fplayer.png?v=1638891925918');
     catI=loadImage('https://cdn.glitch.me/f44b3a75-5142-4137-ab78-df8f3d202ffc%2Fnormal.png?v=1638891959865');
     catInDangerI=loadImage('https://cdn.glitch.me/f44b3a75-5142-4137-ab78-df8f3d202ffc%2Finfected.png?v=1638891994953');
     catDeadI=loadImage('https://cdn.glitch.me/f44b3a75-5142-4137-ab78-df8f3d202ffc%2Fdead.png?v=1638892024501');
     heartFull_i = loadImage('https://cdn.glitch.me/f44b3a75-5142-4137-ab78-df8f3d202ffc%2Ffullheart.png?v=1638892519481');
     heartEmpty_i = loadImage('https://cdn.glitch.me/f44b3a75-5142-4137-ab78-df8f3d202ffc%2Fempty_heart.png?v=1638892489728');
   }
   
   function setup(){
     createCanvas(windowWidth-20, windowHeight-30);
     textFont('DM Sans');
     player = new user();
     boundX = windowWidth-20;
     boundY = windowHeight-30;
     cats = [];
     numSaved=0;
     compteur=0;
     isNewRecord="false"
     
     //time=0;
     let col = color(37, 143, 247); //use color instead of fill
     restartBtn = createButton('Restart');
     restartBtn.position(boundX/2-80, boundY/1.5);
     restartBtn.size(200,50);
     restartBtn.style("font-family", "Comic Sans MS");
     restartBtn.style("font-size", "35px");
     restartBtn.style('background-color', col);
     
     restartBtn.hide();
    for(var i=0; i<10; i++){ 
      cats.push(new cat(random(diameter+15, boundX-diameter-15),random(15,boundY-diameter-25)));
      cats[i].state=percentageChance(['I', 'A'], [20,80]);
    }

    highScore=getItem('highScore');
    //champion=getItem('champion');

    var config = {
      apiKey: "AIzaSyBFmbCpECaybC73EouLcBNTH8BQH7ddYT8",
      authDomain: "covidgame-79b22.firebaseapp.com",
      databaseURL: "https://covidgame-79b22-default-rtdb.firebaseio.com",
      projectId: "covidgame-79b22",
      storageBucket: "covidgame-79b22.appspot.com",
      messagingSenderId: "944160173029"
  }
    firebase.initializeApp(config); 
    //console.log(firebase);
    var database=firebase.database();

    // const db=firebase.firestore();
    // db.settings({timestampsInSnapshots:true});
    // db.collection('scores').get().then((snapshot)=>{
    //   console.log(snapshot.docs);
    // });
//     var docRef = db.collection("scores");
//     docRef.get().then((doc) => {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }).catch((error) => {
//     console.log("Error getting document:", error);
// });
    var ref= database.ref('scores');
    var data={
      score:highScore
    }
    ref.push(data);
    //NEED kinda show the rule for a few seconds for getting started?
    }
   
   function draw(){
    background("#000000");
    noStroke();
    catsDisplay();
    player.display();
    fill('#ffffff');
    textStyle(BOLD);
    text(`Score : ${numSaved}`,20,windowHeight-45);
    textStyle(BOLD);
    text(` High Score : ${highScore} `,90,windowHeight-45);
    //- Champion : ${champion}
    checkGameOver();
    player.livesDisplay();
    if(gameOver==false){
      catsControl();
      compteur++;
      if (compteur==120){ //new cat every 2 seconds
        cats.push(new cat(random(diameter+15, boundX-diameter-15),random(15,boundY-diameter-25)));
        compteur=0;
        
      }
    }
    else{
      {
        restartBtn.show();
        newHighScore();   
        restartBtn.mousePressed(resetSim);
        gameOver=false;
      }

    }

   }
   class user{
     constructor(){
       this.x=mouseX;
       this.y=mouseY;
       this.d=40;
       this.lives=3;
     }
     move(){
       this.x=mouseX;
       this.y=mouseY;
     }
     livesDisplay(){
      text("Lives: ",20,windowHeight-90);
      let startPos = 20;
       for(var i = 0; i < 3; i++) {
         if(i<this.lives) {
           image(heartFull_i, startPos+25*i, windowHeight-80, 20, 20);
         }
         else {
           image(heartEmpty_i, startPos+25*i, windowHeight-80, 20, 20);
         }
       }
     }
    display(){
      this.x=mouseX-diameter/2;
      this.y=mouseY-diameter/2;
      image(playerI,this.x,this.y,90,90);
    }
  }
  class cat{
    constructor(x,y){
      this.x=x;
      this.y=y;
      this.state="A";
      this.speedX=random(-5,5);
      this.speedY=random(-5,5);
      this.dangerTime=180;//NEED to clatify how much time actually
      this.vx=0;
      this.vy=0;

    }
    die(){
      if(this.dangerTime<=0 && this.state !="D"){
        
        this.state="D";
        
        player.lives--;
      }
    }//NEED to implements this method

    collideUser() {
      if(collideCircleCircle(this.x,this.y,diameter*1.85,player.x, player.y, player.d) && this.state == "I" && player.lives>0) {
        this.state="A";
        this.dangerTime = 200;
        numSaved+=1;
      }
    }
    move(){
      if(this.state!="D" && this.state!="I"){
        if(this.x<0||this.x>boundX-(diameter+15)) {
          this.speedX = -1*(this.speedX);
        }
        else if(this.y<0|| this.y>boundY-(diameter+15)) {
          this.speedY = -1*(this.speedY);
        }
        
          this.x=this.x+this.speedX;  
          this.y=this.y+this.speedY; 
        
      }
      else{
        this.speedX=0;
        this.speedY=0;
      }
    }
    display(){
      if(this.state=="A"){
        image(catI,this.x,this.y,90,90);
      }
      else if(this.state=="D"){
        image(catDeadI,this.x,this.y,90,90);
      }
      else{
        image(catInDangerI,this.x,this.y,90,90);
      }
    }
//NEED if do this then the move would need to be way more complicated
    collide() { 
      for(let i = 0; i<cats.length; i++){
        // console.log(others[i]);
        let dx = this.others[i].x - this.x;
        let dy = this.others[i].y - this.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDist = this.others[i].diameter / 2 + this.diameter / 2;
        //   console.log(distance);
        //console.log(minDist);
        if (distance < minDist) {
          //console.log("2");
          let angle = atan2(dy, dx);
          let targetX = this.x + cos(angle) * minDist;
          let targetY = this.y + sin(angle) * minDist;
          let ax = (targetX - this.others[i].x) * spring;
          let ay = (targetY - this.others[i].y) * spring;
          this.vx -= ax;
          this.vy -= ay;
          this.others[i].vx += ax;
          this.others[i].vy += ay;
        }
      }
    }
  }
  function catsDisplay(){
    for(var i=0; i< cats.length;i++){
      cats[i].display();
    }
  }
//NEED function decrease timetilDead
  function catsControl(){
    if(!mouseIsPressed){
      for(var i = 0; i<cats.length; i++){
        if(cats[i].state=="I"){ //NEED to check if it works
          cats[i].dangerTime--;
          cats[i].die();
          cats[i].collideUser();
        }else if(cats[i].state=="D"){
          cats[i].dangerTime--;
          if(cats[i].dangerTime<=-200){
            cats[i].x=-100;
            cats[i].y=-100;
          }
        }
        else{
        //cat[i].collide();  //To late to make to work ;-;
        cats[i].move();
        
        cats[i].state=percentageChance(['I', 'A'], [3,999]);
        }
      }  
    }
    
    
  }

  function resetSim(){
    restartBtn.hide();
    player.x=0;
    player.y=0;
    player.lives=3;
    gameOver=false;
    cats=[];
    numSaved=0;
    isNewRecord=false;
    //time=0;
    for(var i=0; i<10; i++){ 
      cats.push(new cat(random(diameter, boundX-diameter-15),random(15,boundY-diameter-15)));
      cats[i].state=percentageChance(['I', 'A'], [20,80]);
      }
  }
  function checkGameOver(){
    if(player.lives<=0){
      gameOver=true;
      //finalString = blurb.concat("Game Over! Restart?");
    }
    
    //NEED to check if blurb works like this
  }
  function isHighScore(){
    if(numSaved>highScore && gameOver==true){
      storeItem('highScore',numSaved);
      highScore=numSaved;
      isNewRecord=true;
      // championS=createInput();
      // championS.position(boundX/1.55, boundY/2.5);
      // championS.size(85,30);
      // champion=championS.value();
      textSize(12);
    }
  }
  function newHighScore(){
    isHighScore();
    if(isNewRecord==true){
      textStyle(BOLD);
      fill('#50aefa');
      textSize(60);
      textFont('Permanent Marker');
      textNeon(`${highScore}`, boundX/1.4-10, boundY/3,color(332, 58, 91, 100));
      textNeon(`NEW HIGH SCORE`, boundX/4+10, boundY/3,color(332, 58, 91, 100));
      //textSize(30);    
      //text(`Please enter your name :`, boundX/3+10, boundY/2-30);
      textSize(12);
      //champion=championS.value();

      
    }
    else{
      textSize(45);
      textNeon(`BETTER LUCK NEXT TIME`, boundX/3-25, boundY/3,color(332, 58, 91, 100))
      textSize(12);
    }
  }
  
  var arrayShuffle = function(array) {
    for ( var i = 0, length = array.length, swap = 0, temp = ''; i < length; i++ ) {
       swap        = Math.floor(Math.random() * (i + 1));
       temp        = array[swap];
       array[swap] = array[i];
       array[i]    = temp;
    }
    return array;
  };
  
  var percentageChance = function(values, chances) {
    for ( var i = 0, pool = []; i < chances.length; i++ ) {
       for ( var i2 = 0; i2 < chances[i]; i2++ ) {
          pool.push(i);
       }
    }
    return values[arrayShuffle(pool)['0']];
  };
   // console.log(percentageChance(['hi', 'test', 'bye'], [80, 15, 5])); ->80%hi, 15%test, 5%bye
  /////////////////////end of getting value based on percentage
  function textNeon(glowText, x, y, glowColor){
    glow(glowColor, 400);
    text(glowText, x, y);
    text(glowText, x, y);
    glow(glowColor, 80);
    text(glowText, x, y);
    text(glowText, x, y);
    glow(glowColor, 12);
    text(glowText, x, y);
    text(glowText, x, y);
  }

  function glow(glowColor, blurriness){
    drawingContext.shadowBlur = blurriness;
    drawingContext.shadowColor = glowColor;
  }
    