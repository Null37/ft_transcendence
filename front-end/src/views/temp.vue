<script lang="ts">
	import Vue from 'vue';
	import P5 from "p5";
	import io from 'socket.io-client';
	import axios from 'axios';
	import { Buffer } from 'buffer/'; // slash at the end is intended
	
	import VueToast from 'vue-toast-notification';
	import 'vue-toast-notification/dist/theme-sugar.css';
	Vue.use(VueToast, { position: 'top-right' });
	
	export default Vue.extend({
		data: () => ({
			socketURL: "" as string,
			gameSocket: null as any,
			playerMode: 'spectator' as string,
			playerSide: 'seat' as string,
			gameId: "" as string,
		}),
	
		methods: {
		},
	
		// called before mounted
		async created() {
			this.socketURL = location.protocol + "//" + location.hostname + ":" + 3000 + "/canvas";
			const token = localStorage.getItem('token');
	
			// VALIDATING
			// valid id (exists in db)
			if (typeof this.$route.query.match === "string") // avoiding null in string
				this.gameId = this.$route.query.match
	
			// no query in uri
			if (this.gameId === "") {
	
				this.$router.push({ name: 'Game', params: { error: "Oops! Game was not found!" } }).catch(() => {});
				return ;
			}
	
			// search id in database
			if (!token)
			{
				this.$router.push({ name: 'Game', params: { error: "Who are you?! Are you logged in?" } }).catch(() => {});
				return ;
			}
	
			const axerr = await axios.get('/verify_game/' + this.gameId,
			{ headers: { Authorization: token } })
	
			.then((res: any) => {

	
				// data not recieved properly
				if (typeof res.data !== 'object')
				{
					this.$router.push({ name: 'Game', params: { error: "Oops! Something went wrong!" } }).catch(() => {});
					return 1;
				}
	
				// game already ended
				if (res.data.finished == 1)
				{
					this.$router.push({ name: 'Game', params: { error: "This game has expired!" } }).catch(() => {});
					return 1;
				}
	
				if (res.data.finished == 0)
				{
					let usr = JSON.parse(Buffer .from(token.split('.')[1], 'base64').toString('utf8'));
					
					if (usr.sub === res.data.player_one.id) {
	
						this.playerMode = 'player';
						this.playerSide = 'left';
					}
					
					if (usr.sub === res.data.player_two.id) {
	
						this.playerMode = 'player';
						this.playerSide = 'right';
					}
				}
	
				return 0;
			})
	
			.catch((err: any) => {
	
				Vue.$toast.error( 'An error occured! Going back to lobby in 5s');

	
				setTimeout(() => {
					this.$router.push({ name: 'Game', params: { error: "Sorry for the inconvience please report this incident!" } }).catch(() => {});
				}, 5 * 1000);
				return 1;
			});
	
			if (axerr)
				return ;
			// VALIDATING
	
	
			this.gameSocket = io(this.socketURL, {
				transportOptions: {
					polling: { extraHeaders: {
						Authorization: 'Bearer ' + localStorage.getItem('token'),
						gameid: this.gameId,
				} },
				},
			});
	
			// get acknowledgement that server recieved the read
			this.gameSocket.on("playerReadyDone", (data: any) => {
			});
	
			// Infrom the server that the current player/ready is ready to receive data
			this.gameSocket.emit("playerReady", { gameid: this.gameId, side: this.playerSide });
		},
	
		mounted() {

			const HEIGHT: number = 600;
			const WIDTH: number = 800;
	
			let barWidth: number = 20;
			let barHeight: number = 80;
			let ballWidth: number = 20;
	
			let xBarLeft: number = 0;
			let yBarLeft: number = HEIGHT/2;
	
			let xBarRight: number = WIDTH - barWidth;
			let yBarRight: number = HEIGHT/2;
	
			let barSpeed: number = 7;
	
			let leftX: number = xBarLeft;
			let leftY: number = yBarLeft;
	
			let rightX: number = xBarRight;
			let rightY: number = yBarRight;
	
			let xBall: number = WIDTH / 2;
			let yBall: number = HEIGHT / 2;
			let xBallSpeed: number = 4;
			let yBallSpeed: number = -4;
	
			let pause_ball: number = 0;
	
			let scoreP1: number = 0;
			let scoreP2: number = 0;
	
			let timeoutid: number = 0;
	
	
			const bg = (p5: P5) => {
				p5.background(51);
			}
	
	
			const initAll = () => {
	
				xBarLeft = 0;
				yBarLeft = HEIGHT/2;
	
				xBarRight = WIDTH - barWidth;
				yBarRight = HEIGHT/2;
	
				barSpeed = 7;
	
				leftX = xBarLeft;
				leftY = yBarLeft;
		
				rightX = xBarRight;
				rightY = yBarRight;
	
				xBall = WIDTH / 2;
				yBall = HEIGHT / 2;
				xBallSpeed = 4;
				yBallSpeed = -4;
	
				barWidth = 20;
				barHeight = 80;
	
				scoreP1 = 0;
				scoreP2 = 0;
			}
	
	
			// This function draws the left player's bar
			const LBar = (p5: P5) => {
	
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
				p5.rect(xBarLeft, yBarLeft, barWidth, barHeight);
	
				p5.fill(255,255,255);
				p5.circle(xBarLeft, yBarLeft, 1);
			}
	
			// This function draws the right player's bar
			const RBar = (p5: P5) => {
	
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
				p5.rect(xBarRight, yBarRight, barWidth, barHeight);

				p5.fill(255,255,255);
				p5.circle(xBarRight, yBarRight, 1);
			}

			const movement = (p5: P5) => {

				if (pause_ball == 0) {
					xBall += xBallSpeed;
					yBall += yBallSpeed;
				}

				p5.fill(255);
				p5.circle(xBall, yBall, 20);
	
				p5.fill(255,0,0);
				p5.circle(xBall, yBall, 1);
			}

			const scoreBall = () => {
	
				xBall = WIDTH / 2;
				yBall = HEIGHT / 2;
				pause_ball = 1;
				p5.noLoop();
				bg(p5);
				LBar(p5);
				RBar(p5);
				// result(p5);
	
				p5.fill('white');
				p5.textSize(75);
				p5.text(3, WIDTH / 2, HEIGHT / 2);
	
				timeoutid = setTimeout(() => {
					bg(p5);
					LBar(p5);
					RBar(p5);
					result(p5);
					p5.fill('white');
					p5.textSize(75);
					p5.text(2, WIDTH / 2, HEIGHT / 2);
	
					timeoutid = setTimeout(() => {
						bg(p5);
						LBar(p5);
						RBar(p5);
						result(p5);
						p5.fill('white');
						p5.textSize(75);
						p5.text(1, WIDTH / 2, HEIGHT / 2);
	
						timeoutid = setTimeout(() => {
							play();
	
						}, 1000);
	
					}, 1000);
	
				}, 1000);
	
			}
	
			// outer function
			// stops the game and resets the score & ball - players position
			function resetGame ()
			{
				clearTimeout(timeoutid);
				initAll();
				bg(p5);
				LBar(p5);
				RBar(p5);
				result(p5);
				pause_ball = 1;
				movement(p5);
				pause_ball = 0;
				p5.noLoop();
			} document.getElementById("resetBtn")!.onclick = resetGame;
	
			// outer function
			function play ()
			{
				pause_ball = 0;
				p5.loop();
			} document.getElementById("startBtn")!.onclick = play;
	
			// outer function
			function pauseGame()
			{
				pause_ball = 1;
			} document.getElementById("pauseBtn")!.onclick = pauseGame;
	
			const bounceWall = (p5: P5) => {
	
				if (xBall <= barWidth || xBall >= WIDTH - barWidth) 
				{
					xBallSpeed *= -1;
	
					// left goal
					if(xBall - ballWidth/2 < barWidth && (yBall < yBarLeft || yBall > yBarLeft + barHeight))
					{
						scoreBall();
						scoreP2+=1;
					}
	
					// right goal
					if (xBall + ballWidth/2 > WIDTH - barWidth && (yBall < yBarRight || yBall > yBarRight + barHeight))
					{
						scoreBall();
						scoreP1+=1;
					}
				}
	
				if (yBall - ballWidth/2 < 0 || yBall + ballWidth/2 > HEIGHT)
					yBallSpeed *= -1;
			}
	
			const result = (p5: P5) => {
	
				p5.fill('white');
				p5.textSize(45);
				p5.text(scoreP1, WIDTH/3 , 40);
				// 1/3 + 1/3   =       2/3
				p5.text(scoreP2, WIDTH*2/3, 40);
			}
	
	
			// Creating the sketch itself
			const sketch = (p5: P5) => {
	
				// The sketch setup method 
				p5.setup = () => {
					// Creating and positioning the canvas
					const canvas = p5.createCanvas(WIDTH, HEIGHT);
					canvas.parent("game");
	
					// Disabling borders
					p5.noStroke();
					bg(p5);
	
					LBar(p5);
					RBar(p5);
					movement(p5);
	
					// stoping the game from starting
					p5.noLoop();
				};
	
	
				// The sketch draw method
				// Game loop
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
	
					// move the ball
					movement(p5);
					// correct the ball movement
					bounceWall(p5);
					result(p5);
				};
			};
	
			const p5 = new P5(sketch);
	
			// outer function
			const TestMe = () =>
			{
				// // pause_ball = 0;
				// p5.loop();
				// setTimeout(() => {
				//     // pause_ball = 1;
				//     p5.noLoop();
				// }, 10);
				this.gameSocket.emit("playerReady");
			}
			document.getElementById("testBtn")!.onclick = TestMe;
		}
	});
</script>