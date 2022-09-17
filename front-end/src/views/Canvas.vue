<script lang="ts">
import Vue from 'vue';
import P5 from "p5";
import io from 'socket.io-client';
import axios from 'axios';
import { Buffer } from 'buffer/'; // slash at the end is intended

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast, { position: 'top-right' });

const HEIGHT = 600;
const WIDTH = 800;
const BARWIDTH = 20;
const BARHEIGHT = 80;
const BALLRADIUS = 20;

export default Vue.extend({
    data: () => ({
        socketURL: "" as string,
        gameSocket: null as any,
        playerMode: 'spectator' as string,
        playerSide: 'seat' as string,
        gameId: "" as string,
        timefunc: null as null | Function,
        gameover: false as boolean,
        isLoading: false as boolean,
        seconds: 5 as number,

        leftScore: 0 as number,
        rightScore: 0 as number,

        p5: null as P5 | null,

        ballH: WIDTH/2 as number,
        ballV: HEIGHT/2 as number,

        leftbarH: 0 as number,
        leftbarV: HEIGHT/2 - BARHEIGHT/2 as number,

        rightbarH: WIDTH - BARWIDTH as number, // 800 - 20 = 720
        rightbarV: HEIGHT/2 - BARHEIGHT/2 as number, // 600/2 - 80/2 = 260
    }),

    methods: {
    },

    // called before mounted
    async created() {
        this.socketURL = location.protocol + "//" + location.hostname + ":" + 3000 + "/canvas";
        // console.log(this.socketURL, 'SOCKET URL CANVAS.VUE');
        const token = localStorage.getItem('token');

        // VALIDATING
        // valid id (exists in db)
        if (typeof this.$route.query.match === "string") // avoiding null in string
            this.gameId = this.$route.query.match

        // no query in uri
        if (this.gameId === "") {

            console.log('redirecting with missing identifier error', this.gameId);
            this.$router.push({ name: 'Game', params: { error: "Oops! Game was not found!" } });
            return ;
        }

        // search id in database
        if (!token)
        {
            console.log('redirecting with auth error');
            this.$router.push({ name: 'Game', params: { error: "Who are you?! Are you logged in?" } });
            return ;
        }

        const axerr = await axios.get('/verify_game/' + this.gameId,
        { headers: { Authorization: token } })

        .then((res: any) => {
            // console.table(res.data);

            // data not recieved properly
            if (typeof res.data !== 'object')
            {
                console.log('redirecting with data error: axios');
                this.$router.push({ name: 'Game', params: { error: "Oops! Something went wrong!" } });
                return 1;
            }

            // game already ended
            if (res.data.finished == 1)
            {
                console.log('redirecting with expiration error');
                this.$router.push({ name: 'Game', params: { error: "This game has already finished!" } });
                return 1;
            }

            if (res.data.finished == 0)
            {
                let usr = JSON.parse(Buffer .from(token.split('.')[1], 'base64').toString('utf8'));
                // console.log('PLAYER DETAILS', res.data.player_one, res.data.player_two);

                if (usr.sub === res.data.player_one.id) {

                    this.playerMode = 'player';
                    this.playerSide = 'left';
                }

                if (usr.sub === res.data.player_two.id) {

                    this.playerMode = 'player';
                    this.playerSide = 'right';
                }

                window.document.querySelector("#leftPlayer")!.innerHTML = res.data.player_one.username.toUpperCase();
                window.document.querySelector("#rightPlayer")!.innerHTML = res.data.player_two.username.toUpperCase();
            }

            return 0;
        })

        .catch((err: any) => {

            Vue.$toast.error( 'An error occured! Going back to lobby in 5s');
            console.error('axios : verify_game ERROR', err);

            setTimeout(() => {
                this.$router.push({ name: 'Game', params: { error: "Sorry for the inconvience please report this incident!" } });
            }, 5 * 1000);
            return 1;
        });

        if (axerr)
            return ;
        // VALIDATING

        // console.log('CLIENT GAME ID', this.gameId);

        this.gameSocket = io(this.socketURL, {
            extraHeaders: { "c": "d" },
            transportOptions: {
                polling: { //extraHeaders: {
                    "a": "b",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
            },// },
            query: {
                xyz: 42
            },
            auth: {
                param: 'value',
            }
            },
        });

        // Infrom the server that the current player/ready is ready to receive data
        this.gameSocket.emit("playerReady", { gameid: this.gameId, side: this.playerSide });
        this.gameSocket.on("testing", (data: any) => {
            // 
            console.log('IT WORKED', data);
        });


        this.gameSocket.on("recieveCoord", (data: any) => {
            console.log("CLIENT: GOT COORDINATION FROM SERVER!", data);

            // start game for the first time ever
            if (this.p5?.isLooping() === false && this.gameover === false)
                this.p5?.loop();

            // update current ball position
            this.ballH = data.ballH;
            this.ballV = data.ballV;

            // update left palyer's bar
            this.leftbarH = data.leftbarH;
            this.leftbarV = data.leftbarV;

            // update right palyer's bar
            this.rightbarH = data.rightbarH;
            this.rightbarV = data.rightbarV;

            // update scores
            this.leftScore = data.leftScore;
            this.rightScore = data.rightScore;
        });

        this.gameSocket.on("gamefinished", (data: any) => {

            console.log("CLIENT: GAME OVER!");
            this.p5?.noLoop();
            this.gameover = true;
            // redirect
        });

        // get acknowledgement that server recieved the read
        this.gameSocket?.on("setCountdown", (data: any) => {
            console.log("CLIENT: Got countdown!", data);

            // start game here...
            // this.p5?.redraw();
            // this.p5?.textAlign(this.p5.CENTER);
            // this.p5?.fill(255, 255, 255);
            // this.p5?.text(data.seconds, WIDTH/2, HEIGHT/2);
            // this.p5?.redraw();


            this.isLoading = true;
            this.seconds = data.seconds;
            this.p5?.redraw();
            this.isLoading = false;

            // console.log(this.p5);

        });
    },

    mounted() {

        // Creating the sketch itself
        const sketch = (p5: P5) => {

            // The sketch setup method 
            p5.setup = () => {
                // Creating and positioning the canvas
                const canvas = p5.createCanvas(WIDTH, HEIGHT);
                canvas?.parent("game");

                // Disabling borders
                p5.noStroke();
                p5.background(51);

                // stoping the game from starting
                p5.noLoop();
            };


            // The sketch draw method
            // Game loop
            p5.draw = () => {
                console.log('still going');

                if (this.playerMode !== "spectator") {

                    if (p5.keyIsDown(p5.UP_ARROW)) {
                        this.gameSocket.emit('moveBarUp', { id: this.gameId, side: this.playerSide } );
                    }
                    if (p5.keyIsDown(p5.DOWN_ARROW)) {
                        this.gameSocket.emit('moveBarDown', { id: this.gameId, side: this.playerSide } );
                    }
                }

                p5.background(51);

                // left bar
				p5.fill(255, 255, 255);
				p5.rect(this.leftbarH, this.leftbarV, BARWIDTH, BARHEIGHT);


                // right bar
				p5.fill(255, 255, 255);
				p5.rect(this.rightbarH, this.rightbarV, BARWIDTH, BARHEIGHT);


                // ping pong ball
				p5.fill(255);
				p5.circle(this.ballH, this.ballV, BALLRADIUS);

                if (this.isLoading) {

                    // console.log("should draw...", this.seconds);
                    this.p5?.textAlign(this.p5.CENTER);
                    this.p5?.fill('white');
                    this.p5?.textSize(75);
                    this.p5?.stroke('dodgerblue');
                    this.p5?.text(this.seconds, WIDTH/2, HEIGHT/2);
                    this.p5?.noStroke();
                }
            };
        };

        this.p5 = new P5(sketch);
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
            <div class="text-center">
                <div style="width:100%;">
                    <div style="display:inline-block;width:20%;text-align:center;">
                        <div id="leftPlayer">PLAYER ONE</div>
                        <div style="font-weight: bold;font-size: 50px;" >{{ leftScore }}</div>
                    </div>

                    <div style="display:inline-block;width:60%;text-align:center;">
                        <h1>Ping Pong Match</h1>
                        <small>(UP - DOWN)</small><br/>
                        <div>
                            <a href="/game" class="btn" >Surrender!</a>
                        </div>
                    </div>

                    <div style="display:inline-block;width:19%;text-align:center;">
                        <div id="rightPlayer">PLAYER TWO</div>
                        <div style="font-weight: bold;font-size: 50px;" >{{ rightScore }}</div>
                    </div>
                </div>
                <div style="text-align: center;margin: 10px;">
                    <!-- <button class="btn" id="startBtn" onclick="play()" >Start!</button>
                    <button class="btn" id="pauseBtn" onclick="pauseGame()" >Pause!</button>
                    <button class="btn" id="resetBtn" onclick="resetGame()" >Reset!</button> -->
                    <!-- <a href="/game" class="btn" >Surrender!</a> -->
                    <!-- <button class="btn" id="testBtn" onclick="TestMe()" >Test!</button>
                    <button class="btn" id="testBtn1" onclick="TestMe1()" >Ping!</button>
                    <button class="btn" id="testBtn2" onclick="TestMe2()" >LoopIt!</button> -->
                </div>
                <div id="game"></div>
            </div>
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
.btn {
    margin: 5px;
    padding: 2px 5px;
    border: 1px solid #e7e7e7;
    background-color: #373737;
    border-radius: 5px;
}
</style>