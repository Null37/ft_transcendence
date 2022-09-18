import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { GamesService } from "./games/games.service";
import { UsersService } from "./users/users.service";

interface GameObj {
    p1SockId: string,
	p2SockId: string,
	gameid: string,
	spectators: string[],
	finished: number,
}

const searchForGame = (gp: GameObj[], gid: string) => {

	let ind: number = gp.findIndex(
		(elm: any) => elm.gameid == gid);
	return ind;
}

const HEIGHT: number = 600;
const WIDTH: number = 1000;
const BARWIDTH: number = 20;
const BARHEIGHT: number = 80;
const BARSPEED: number = 4; // speedy version
const BARSPEEDP: number = BARSPEED * 2; // speedy version
const WINSCORE: number = 4;

const BALLRADIUS: number = 20;
var HBALLSPEED: number = 4;
var VBALLSPEED: number = HBALLSPEED * -1;
var HBALLSPEEDP: number = HBALLSPEED * 2; // speedy version
var VBALLSPEEDP: number = HBALLSPEEDP * -1; // speedy version

@WebSocketGateway({
	cors: { origin: "*" },
	namespace: "/canvas"
})
export class CanvasGateway implements OnGatewayInit, OnGatewayConnection{
	@WebSocketServer() wss: Server;

	constructor(
		private readonly gamesservice: GamesService,
		private readonly userservice: UsersService,
	){}

	private gamePlayers: Array<GameObj> = [];

	private ballH: Array<number> = [];
	private ballV: Array<number> = [];

	private leftbarH: Array<number> = [];
	private leftbarV: Array<number> = [];

	private rightbarH: Array<number> = [];
	private rightbarV: Array<number> = [];

	private leftScore: Array<number> = [];
	private rightScore: Array<number> = [];

	private gameTimers: Array<any> = [];
	private ballTimers: Array<any> = [];
	private startTimers: Array<any> = [];

	initBallnBar(ind: number) {

		this.ballH[ind] = WIDTH/2;
		this.ballV[ind] = HEIGHT/2;

		this.leftbarH[ind] = 0;
		this.leftbarV[ind] = HEIGHT/2 - BARHEIGHT / 2;

		this.rightbarH[ind] = WIDTH - BARWIDTH;
		this.rightbarV[ind] = HEIGHT/2 - BARHEIGHT / 2;
	}

	startCountdown(ind: number) {

		this.startTimers[ind] = setTimeout(() => {
			console.log("SERVER: set timeOUT 5");
			this.wss.to(
				[this.gamePlayers[ind].p1SockId, this.gamePlayers[ind].p2SockId].concat
				(this.gamePlayers[ind].spectators)
				).emit('setCountdown', { seconds: 5, });

			this.startTimers[ind] = setTimeout(() => {
				console.log("SERVER: set timeOUT 4");
				this.wss.to(
					[this.gamePlayers[ind].p1SockId, this.gamePlayers[ind].p2SockId].concat
					(this.gamePlayers[ind].spectators)
					).emit('setCountdown', { seconds: 4, });

				this.startTimers[ind] = setTimeout(() => {
					console.log("SERVER: set timeOUT 3");
					this.wss.to(
						[this.gamePlayers[ind].p1SockId, this.gamePlayers[ind].p2SockId].concat
						(this.gamePlayers[ind].spectators)
						).emit('setCountdown', { seconds: 3, });

					this.startTimers[ind] = setTimeout(() => {
						console.log("SERVER: set timeOUT 2");
						this.wss.to(
							[this.gamePlayers[ind].p1SockId, this.gamePlayers[ind].p2SockId].concat
							(this.gamePlayers[ind].spectators)
							).emit('setCountdown', { seconds: 2, });

						this.startTimers[ind] = setTimeout(() => {
							this.wss.to(
								[this.gamePlayers[ind].p1SockId, this.gamePlayers[ind].p2SockId].concat
								(this.gamePlayers[ind].spectators)
								).emit('setCountdown', { seconds: 1, });

							this.startTimers[ind] = setTimeout(() => {
								this.startGame(ind);

							}, 1000);
						}, 1000);
					}, 1000);
				}, 1000);
			}, 1000);
		}, 1000);
	}

	startGame(ind: number) {

		this.leftScore[ind] = 0;
		this.rightScore[ind] = 0;

		this.gameTimers[ind] = setInterval(() => {

			this.ballH[ind] += HBALLSPEED;
			this.ballV[ind] += VBALLSPEED;

			if (this.ballH[ind] <= BARWIDTH || this.ballH[ind] >= WIDTH - BARWIDTH) 
			{
				HBALLSPEED *= -1;

				// left goal
				if(this.ballH[ind] - BALLRADIUS/2 < BARWIDTH &&
				  (this.ballV[ind] < this.leftbarV[ind] ||
				   this.ballV[ind] > this.leftbarV[ind] + BARHEIGHT))
				{
					// score for p2
					this.rightScore[ind] += 1;
					if (this.rightScore[ind] >= WINSCORE) {

						// stop game
						clearInterval(this.gameTimers[ind]);
						clearInterval(this.ballTimers[ind]);

						// update game in DB
						this.finishGame(ind);

						console.log('SERVER: Sending LOST to ', this.gamePlayers[ind].p1SockId);
						this.wss.to(this.gamePlayers[ind].p1SockId)
						.emit("setText", { message: "LOST" });

						console.log('SERVER: Sending WINNER to ', this.gamePlayers[ind].p2SockId);
						this.wss.to(this.gamePlayers[ind].p2SockId)
						.emit("setText", { message: "WINNER" });

						// game over for spectators
						if (this.gamePlayers[ind].spectators.length > 0) {
							console.log('SERVER: Sending GAME OVER to ', this.gamePlayers[ind].spectators);
							this.wss.to(this.gamePlayers[ind].spectators)
							.emit("setText", { message: "GAME OVER" });
						}
					}
					this.initBallnBar(ind);
				}

				// right goal
				if (this.ballH[ind] + BALLRADIUS/2 > WIDTH - BARWIDTH &&
				   (this.ballV[ind] < this.rightbarV[ind] ||
					this.ballV[ind] > this.rightbarV[ind] + BARHEIGHT))
				{
					// score for p1
					this.leftScore[ind] += 1;
					if (this.leftScore[ind] >= WINSCORE) {

						// stop game
						clearInterval(this.gameTimers[ind]);
						clearInterval(this.ballTimers[ind]);

						// update game in DB
						this.finishGame(ind);
						console.log('SERVER: Sending WINNER to ', this.gamePlayers[ind].p1SockId);
						this.wss.to(this.gamePlayers[ind].p1SockId)
						.emit("setText", { message: "WINNER" });

						console.log('SERVER: Sending LOST to ', this.gamePlayers[ind].p2SockId);
						this.wss.to(this.gamePlayers[ind].p2SockId)
						.emit("setText", { message: "LOST" });
		
						// game over for spectators
						if (this.gamePlayers[ind].spectators.length > 0) {
							console.log('SERVER: Sending GAME OVER to ', this.gamePlayers[ind].spectators);
							this.wss.to(this.gamePlayers[ind].spectators)
							.emit("setText", { message: "GAME OVER" });
						}
					}
					this.initBallnBar(ind);
				}
			}

			if (this.ballV[ind] - BALLRADIUS/2 < 0 || this.ballV[ind] + BALLRADIUS/2 > HEIGHT)
				VBALLSPEED *= -1;

			this.wss.to(
				[this.gamePlayers[ind].p1SockId, this.gamePlayers[ind].p2SockId].concat
				(this.gamePlayers[ind].spectators)
			).emit('recieveCoord', {
				ballH: this.ballH[ind],
				ballV: this.ballV[ind],
				leftbarH: this.leftbarH[ind],
				leftbarV: this.leftbarV[ind],
				rightbarH: this.rightbarH[ind],
				rightbarV: this.rightbarV[ind],
				leftScore: this.leftScore[ind],
				rightScore: this.rightScore[ind],
			});
		}, 0.025 * 1000);
	}

	finishGame(ind: number) {

		this.gamesservice.finish_game(this.gamePlayers[ind].gameid,
			this.leftScore[ind],
			this.rightScore[ind]);

		this.gamePlayers[ind].finished = 1;

		// notify player and spectators
		this.wss.to(
			[this.gamePlayers[ind].p1SockId, this.gamePlayers[ind].p2SockId].concat
			(this.gamePlayers[ind].spectators)).emit("gamefinished");
	}


	@SubscribeMessage('playerReady')
	handlePlayerReady(client: Socket, ...args: any[]) {

		// console.log('SERVER PLAYER READY', args);

		// initialized game object
		let gp: GameObj = { p1SockId: "", p2SockId: "", gameid: "", spectators: [], finished: 0 };


		// if game already saved
		let ind = searchForGame(this.gamePlayers, args[0].gameid);
		console.log('INDEX PROTECTION ------------- ', ind);


		// **GET** game if already exists or set id if new
		if (ind === -1)
			gp.gameid = args[0].gameid;
		else
			gp = this.gamePlayers[ind];


		// left player entering
		if (args[0].side == 'left')
			gp.p1SockId = client.id;

		// right player entering
		if (args[0].side == 'right')
			gp.p2SockId = client.id;

		// guest watching
		if (args[0].side == 'seat') {
			if (gp.spectators.findIndex( (elm: string) => elm == client.id) === -1)
				gp.spectators.push(client.id);
		}


		// **UPDATE** game if already exists or add new one
		if (ind === -1)
			ind = this.gamePlayers.push(gp) - 1;
		else
			this.gamePlayers[ind] = gp;
		console.log('INDEX MAYBE UPDATED ------------- ', ind);


		if (args[0].side == 'left' || args[0].side == 'right') {

			this.initBallnBar(ind);

			if (this.gamePlayers[ind].p1SockId !== "" && this.gamePlayers[ind].p2SockId !== "") {

				console.log("SERVER: CALLING COUNTDOWN");

				this.startCountdown(ind);
			}
		}


		// console.log(ind, this.gamePlayers);
	}

	@SubscribeMessage('moveBarUp')
	handleMoveBarUp(client: Socket, ...args: any[]) {

		// console.log('SERVER: GOT REQUEST TO MOVE BAR UP', args);

		if (args[0].id === undefined ||
			args[0].side === undefined)
			return ;

		let ind = searchForGame(this.gamePlayers, args[0].id);

		if (args[0].side === 'right') {

			this.rightbarV[ind] -= BARSPEED;

			if (this.rightbarV[ind] < 0)
				this.rightbarV[ind] = 0;
		}

		if (args[0].side === 'left') {

			this.leftbarV[ind] -= BARSPEED;

			if (this.leftbarV[ind] < 0)
				this.leftbarV[ind] = 0;
		}
	}

	@SubscribeMessage('moveBarDown')
	handleMoveBarDown(client: Socket, ...args: any[]) {

		// console.log('SERVER: GOT REQUEST TO MOVE BAR DOWN', args);

		if (args[0].id === undefined ||
			args[0].side === undefined)
			return ;

		let ind = searchForGame(this.gamePlayers, args[0].id);

		if (ind === -1)
			return ;

		if (args[0].side === 'right') {

			this.rightbarV[ind] += BARSPEED;

			if (this.rightbarV[ind] + BARHEIGHT > HEIGHT)
				this.rightbarV[ind] = HEIGHT - BARHEIGHT;
		}

		if (args[0].side === 'left') {

			this.leftbarV[ind] += BARSPEED;

			if (this.leftbarV[ind] + BARHEIGHT > HEIGHT)
				this.leftbarV[ind] = HEIGHT - BARHEIGHT;
		}
	}


	afterInit(server: any) {
		// console.log("SERVER: Match Web Socket initialized!");
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log("SERVER: Match client connected", client.id);
	}

	handleDisconnect(client: Socket) {
		console.log("SERVER: Match client disconnected", client.id);

		// game over if clients disconnects

		// search games
		let ind: number = this.gamePlayers.findIndex(
			(elm: any) => elm.p1SockId === client.id || elm.p2SockId === client.id);
		console.log('SERVER: CLIENT LEFT. INDEX : ', ind);

		// get game player matching this client id
		if (ind !== -1) {

			// if game has not ended
			if (this.gamePlayers[ind].finished == 0) {

				// stop streaming
				clearInterval(this.gameTimers[ind]);
				clearInterval(this.ballTimers[ind]);
				clearInterval(this.startTimers[ind]);

				// left player quitted
				if (client.id === this.gamePlayers[ind].p1SockId) {
					this.leftScore[ind] = 0;
					this.rightScore[ind] = 11;
				}
				// right player quitted
				if (client.id === this.gamePlayers[ind].p2SockId) {
					this.leftScore[ind] = 11;
					this.rightScore[ind] = 0;
				}

				// finish game
				// and broadcast gameover
				this.finishGame(ind);

				// win for other player
				if (client.id === this.gamePlayers[ind].p2SockId) {
					console.log('SERVER: Sending WINNER to ', this.gamePlayers[ind].p1SockId);

					this.wss.to(this.gamePlayers[ind].p1SockId)
					.emit("setText", { message: "WINNER" });
				}

				if (client.id === this.gamePlayers[ind].p1SockId) {
					console.log('SERVER: Sending WINNER to ', this.gamePlayers[ind].p2SockId);

					this.wss.to(this.gamePlayers[ind].p2SockId)
					.emit("setText", { message: "WINNER" });
				}

				// game over for spectators
				console.log('SERVER: Sending GAME OVER to ', this.gamePlayers[ind].spectators);

				if (this.gamePlayers[ind].spectators.length > 0)
					this.wss.to(this.gamePlayers[ind].spectators)
					.emit("setText", { message: "GAME OVER" });
			}
		}

		// remove disconnected spectator
		this.gamePlayers.forEach((elment, index) => {
			let ind2 = elment.spectators.findIndex((elm) => elm == client.id);
			if (ind2 !== -1)
				this.gamePlayers[index].spectators.splice(ind2, 1);
		});
	}

	
}