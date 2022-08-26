<script lang="ts">
import Vue from 'vue';
import P5 from "p5";
// import "p5/lib/addons/p5.dom";

export default Vue.extend({
    data: () => ({
        drawer: null,
        }),
    mounted()
    {
        const HEIGHT = 600;
        const WIDTH = 800;
        const DIMNS = 600;
        let barWidth = 20, barHeight = 80;
        let xBarLeft, yBarLeft, xBarRight, yBarRight;
        let leftX = 0, leftY = 0;
        let rightX = DIMNS - barWidth, rightY = DIMNS - barWidth;
        let barSpeed = 7, ballSpeed = 7;
        let xBall = WIDTH / 2;
        let yBall = HEIGHT / 2;
        let dBall = 20;
        let pause_ball = 0;
        let ballVector = 1;
        var xSpeed = (2, 4);
        var ySpeed = (-2, -4);
        var noteP1 = 0;
        var noteP2 = 0;


        const bg = (p5: P5) => {
            p5.background(51);
        }


        const LBar = (p5: P5) => {
            xBarLeft = 0
            if (leftY < 40)
            {
                yBarLeft = 0;
                leftY = 40;
            }
            else if (leftY < 600 - 40)
            {
                yBarLeft = leftY - 40;
            }
            else
            {
                yBarLeft = 600 - 80;
            }
            p5.fill(255, 204, 0);
            p5.stroke(255, 204, 0);
            p5.rect(xBarLeft, yBarLeft, barWidth, barHeight);
        }

        const RBar = (p5: P5) => {
            xBarRight = WIDTH - barWidth
            if (rightY < 40)
            {
                yBarRight = 0;
                rightY = 40;
            }
            else if (rightY < 600 - 40)
            {
                yBarRight = rightY - 40;
            }
            else
            {
                yBarRight = 600 - 80;
            }
            p5.fill(0, 204, 0);
            p5.stroke(0, 204, 0);
            p5.rect(xBarRight, yBarRight, barWidth, barHeight);
        }
            
        const ball = (p5: P5) => {

            p5.fill(200, 0, 0);
            p5.stroke(200, 0, 0);
            let a = yBarRight ;
            let b = yBarRight + barHeight;
            
            // collision
            // RIGHT
            if ((xBall + dBall/2 >= xBarRight &&
            yBall >= yBarRight &&
            yBall <= yBarRight + barHeight)
                || // LEFT
            (xBall + dBall/2 <= xBarLeft &&
            yBall >= yBarLeft &&
            yBall <= yBarRight + barHeight)) {
                // alert('COLLISION');
                // resetGame();
                ballVector = ballVector == 1 ? 2 : 1;
            }
            console.log(
                xBall, '+', dBall/2, '<=', xBarRight, xBall + dBall/2 <= xBarRight,
                yBall, '>=', yBarRight, yBall >= yBarRight,
                yBall, '<=', yBarRight, '+', barHeight, yBall <= yBarRight + barHeight);
            
            // goal
            if ((xBall + dBall/2) >= WIDTH - barWidth ||
                (xBall - dBall/2) <= 0 + barWidth) {
                alert('GOAL');
                resetGame();
            }
            
            if (pause_ball == 0) {

                if (ballVector == 1)
                    xBall += ballSpeed;
                else if (ballVector == 2)
                    xBall -= ballSpeed;
            }
            
            p5.circle(xBall, yBall, dBall);
            p5.fill(255, 255, 255);
            p5.stroke(255, 255, 255);
            p5.circle(xBall, yBall, 1);
        }

        const movement = (p5: P5) => {
            if (pause_ball == 0) {
                xBall += xSpeed;
                yBall += ySpeed;
            }
            p5.fill(255);
            p5.ellipse(xBall, yBall, 20, 20);
        }

        // outer function
        function resetGame ()
        {
            // p5.noLoop();
            xBall = WIDTH / 2;
            yBall = HEIGHT / 2;
            // p5.redraw();
        } document.getElementById("resetBtn").onclick = resetGame;

        // outer function
        function play ()
        {
            pause_ball = 0;
            p5.loop();
        } document.getElementById("startBtn").onclick = play;

        // outer function
        function pauseGame()
        {
            pause_ball = 1;
        } document.getElementById("pauseBtn").onclick = pauseGame;

        const bounceWall = (p5: P5) => {

            if (xBall <= 20 || xBall > WIDTH - 20) 
            {
                xSpeed *= -1;
                if(xBall < 20 && (yBall < yBarLeft || yBall > yBarLeft + barHeight))
                {
                    resetGame();
                    noteP2+=1;
                }
                else if (xBall > WIDTH - 20 && (yBall < yBarRight || yBall > yBarRight + barHeight))
                {
                    resetGame();
                    noteP1+=1;
                }
            }
            if (yBall < 20 || yBall >= HEIGHT) 
                ySpeed *= -1;
        }

        const result = (p5: P5) => {
            p5.fill('#d9c3f7');
            p5.textSize(20);
            p5.text("PLAYER 1 : " + noteP1, WIDTH/3 , 25);
            p5.text("PLAYER 2 : " + noteP2, WIDTH/3 + 300, 25);
        }


        // Creating the sketch itself
        const sketch = (p5: P5) => {
            // DEMO: Prepare an array of MyCircle instances
            // const myCircles: MyCircle[] = [];

            // The sketch setup method 
            p5.setup = () => {
                // Creating and positioning the canvas
                const canvas = p5.createCanvas(WIDTH, HEIGHT);
                // p5.createCanvas(WIDTH, HEIGHT);
                canvas.parent("game");

                bg(p5);
                // frameRate(120);

                LBar(p5);
                RBar(p5);
                // ball(p5);
                movement(p5);

                p5.noLoop();
            };


            // The sketch draw method
            p5.draw = () => {

                bg(p5);

                if (p5.keyIsDown(p5.UP_ARROW)) {
                    rightY -= barSpeed;
                }
                if (p5.keyIsDown(p5.DOWN_ARROW)) {
                    rightY += barSpeed;
                }
                
                if (p5.keyIsDown(87)) {
                    leftY -= barSpeed;
                }
                if (p5.keyIsDown(83)) {
                    leftY += barSpeed;
                }

                if (p5.keyIsDown(p5.ESCAPE)) {
                    pause_ball = (pause_ball ? 0 : 1);
                }

                LBar(p5);
                RBar(p5);
                // ball(p5);

                movement(p5);
                bounceWall(p5);
                result(p5);
            };
        };

        const p5 = new P5(sketch);

        // outer function
        function TestMe()
        {
            alert('working');
        }
        // window.TestMe = TestMe;
        document.getElementById("testBtn").onclick = TestMe;
    }
});
</script>

<template>
  <v-app id="inspire">
   <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <div class="text-center">
                <div class="container">
                    <h1>p5.js meets Typescript</h1>
                    <div style="width:100%;">
                        <div style="display:inline-block;width:19%;text-align:center;">UP - DOWN</div>
                        <div style="display:inline-block;width:60%;text-align:center;"></div>
                        <div style="display:inline-block;width:20%;text-align:center;">W - S</div>
                    </div>
                    <div style="text-align: center;margin: 10px;">
                        <button class="btn" id="startBtn" onclick="play()" >Start!</button>
                        <button class="btn" id="pauseBtn" onclick="pauseGame()" >Pause!</button>
                        <button class="btn" id="resetBtn" onclick="resetGame()" >Reset!</button>
                        <button class="btn" id="testBtn" onclick="TestMe()" >Test!</button>
                    </div>
                    <div id="game"></div>
                </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>

$bg-color: #283747;
$txt-color: white;

body {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
    background-color: $bg-color;
    color: white;
    font-family: 'Montserrat', sans-serif;
}

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>