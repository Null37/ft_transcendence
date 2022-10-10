import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { GamesService } from "./games/games.service";

interface GameObj {
	// left player
	p1SockId: string[],
	// right player
	p2SockId: string[],
	gameid: string,
	spectators: string[],
	finished: number,
	started: number,
}

const searchForGame = (gp: GameObj[], gid: string) => {

	let ind: number = gp.findIndex(
		(elm: any) => elm.gameid == gid);
	return ind;
}

const WIDTH: number = 1000;
const HEIGHT: number = WIDTH / 2;
const BARWIDTH: number = 20;
const BARHEIGHT: number = 100;
const BARSPEED: number = 8; // speedy version
const WINSCORE: number = 11;

const BALLRADIUS: number = 20;

@WebSocketGateway({
	cors: { origin: "*" },
	namespace: "/speedy"
})
export class SpeedyGateway implements OnGatewayInit, OnGatewayConnection {
	@WebSocketServer() wss: Server;

	constructor(
		private readonly gamesservice: GamesService,
	) { }

	private gamePlayers: Array<GameObj> = [];

	private ballH: Array<number> = [];
	private ballV: Array<number> = [];

	private HBALLSPEED: Array<number> = []; // 10;
	private VBALLSPEED: Array<number> = []; // HBALLSPEED * -1;

	private leftbarH: Array<number> = [];
	private leftbarV: Array<number> = [];

	private rightbarH: Array<number> = [];
	private rightbarV: Array<number> = [];

	private leftScore: Array<number> = [];
	private rightScore: Array<number> = [];

	private gameTimers: Array<any> = [];
	private startTimers: Array<any> = [];

	initBallnBar(ind: number) {

		this.ballH[ind] = WIDTH / 2;
		this.ballV[ind] = HEIGHT / 2;

		this.HBALLSPEED[ind] = 10;
		this.VBALLSPEED[ind] = this.HBALLSPEED[ind] * -1;

		this.leftbarH[ind] = 0;
		this.leftbarV[ind] = HEIGHT / 2 - BARHEIGHT / 2;

		this.rightbarH[ind] = WIDTH - BARWIDTH;
		this.rightbarV[ind] = HEIGHT / 2 - BARHEIGHT / 2;
	}

	startCountdown(ind: number) {

		this.startTimers[ind] = setTimeout(() => {
			this.wss.to(
				[...this.gamePlayers[ind].p1SockId,
				 ...this.gamePlayers[ind].p2SockId,
				 ...this.gamePlayers[ind].spectators]
			).emit('setCountdownSpeedy', { seconds: 5, });

			this.startTimers[ind] = setTimeout(() => {
				this.wss.to(
					[...this.gamePlayers[ind].p1SockId,
					 ...this.gamePlayers[ind].p2SockId,
					 ...this.gamePlayers[ind].spectators]
				).emit('setCountdownSpeedy', { seconds: 4, });

				this.startTimers[ind] = setTimeout(() => {
					this.wss.to(
						[...this.gamePlayers[ind].p1SockId,
						 ...this.gamePlayers[ind].p2SockId,
						 ...this.gamePlayers[ind].spectators]
					).emit('setCountdownSpeedy', { seconds: 3, });

					this.startTimers[ind] = setTimeout(() => {
						this.wss.to(
							[...this.gamePlayers[ind].p1SockId,
							 ...this.gamePlayers[ind].p2SockId,
							 ...this.gamePlayers[ind].spectators]
						).emit('setCountdownSpeedy', { seconds: 2, });

						this.startTimers[ind] = setTimeout(() => {
							this.wss.to(
								[...this.gamePlayers[ind].p1SockId,
								 ...this.gamePlayers[ind].p2SockId,
								 ...this.gamePlayers[ind].spectators]
							).emit('setCountdownSpeedy', { seconds: 1, });

							this.startTimers[ind] = setTimeout(async () => {
								await this.startGame(ind);

							}, 1000);
						}, 1000);
					}, 1000);
				}, 1000);
			}, 1000);
		}, 1000);
	}

	async startGame(ind: number) {

		this.leftScore[ind] = 0;
		this.rightScore[ind] = 0;

		this.gameTimers[ind] = setInterval(async () => {

			// Ball touched left
			if (this.ballH[ind] - BALLRADIUS / 2 <= BARWIDTH) {
				// Bounce
				if ( (this.ballV[ind] >= this.leftbarV[ind] &&
						this.ballV[ind] <= this.leftbarV[ind] + BARHEIGHT) )
				{
					if (this.ballH[ind] < WIDTH / 2)
					{
						if (this.HBALLSPEED[ind] < 0)
							this.HBALLSPEED[ind] *= -1;
					}
				}
				// Score
				else if ( // passed behind the bar
					(this.ballH[ind] <= BARWIDTH)
				) {
					// score for p1
					this.rightScore[ind] += 1;
					if (this.rightScore[ind] >= WINSCORE) {

						// stop game
						clearInterval(this.gameTimers[ind]);

						// update game in DB
						this.finishGame(ind);
						if (this.gamePlayers[ind].p2SockId.length > 0)
							this.wss.to(this.gamePlayers[ind].p2SockId)
								.emit("setTextSpeedy", { message: "WINNER" });

						if (this.gamePlayers[ind].p1SockId.length > 0)
							this.wss.to(this.gamePlayers[ind].p1SockId)
								.emit("setTextSpeedy", { message: "LOST" });

						// game over for spectators
						if (this.gamePlayers[ind].spectators.length > 0) {
							this.wss.to(this.gamePlayers[ind].spectators)
								.emit("setTextSpeedy", { message: "GAME OVER" });
						}
					}
					this.initBallnBar(ind);

					// pause for a second after scoring
					const date = Date.now();
					let currentDate = null;
					do {
						currentDate = Date.now();
					} while (currentDate - date < 1000);

					this.HBALLSPEED[ind] *= -1;
				}
			}

			// Ball touched right
			if (this.ballH[ind] + BALLRADIUS / 2 >= WIDTH - BARWIDTH) {
				// Bounce
				if ( (this.ballV[ind] >= this.rightbarV[ind] &&
					this.ballV[ind] <= this.rightbarV[ind] + BARHEIGHT) )
				{
					if (this.ballH[ind] > WIDTH / 2)
					{
						if (this.HBALLSPEED[ind] > 0)
							this.HBALLSPEED[ind] *= -1;
					}
				}
				// Score
				else if ( // passed behind the bar
					(this.ballH[ind] >= WIDTH - BARWIDTH)
				) {
					// score for p1
					this.leftScore[ind] += 1;
					if (this.leftScore[ind] >= WINSCORE) {

						// stop game
						clearInterval(this.gameTimers[ind]);

						// update game in DB
						this.finishGame(ind);
						if (this.gamePlayers[ind].p1SockId.length > 0)
							this.wss.to(this.gamePlayers[ind].p1SockId)
								.emit("setTextSpeedy", { message: "WINNER" });

						if (this.gamePlayers[ind].p2SockId.length > 0)
							this.wss.to(this.gamePlayers[ind].p2SockId)
								.emit("setTextSpeedy", { message: "LOST" });

						// game over for spectators
						if (this.gamePlayers[ind].spectators.length > 0) {
							this.wss.to(this.gamePlayers[ind].spectators)
								.emit("setTextSpeedy", { message: "GAME OVER" });
						}
					}
					this.initBallnBar(ind);

					// pause for a second after scoring
					const date = Date.now();
					let currentDate = null;
					do {
						currentDate = Date.now();
					} while (currentDate - date < 1000);

					this.HBALLSPEED[ind] *= -1;
				}
			}

			// Ball touched top or bottom
			if (this.ballV[ind] - BALLRADIUS / 2 < 0 ||
				this.ballV[ind] + BALLRADIUS / 2 > HEIGHT)
				this.VBALLSPEED[ind] *= -1;

			this.ballH[ind] += this.HBALLSPEED[ind];
			this.ballV[ind] += this.VBALLSPEED[ind];

			this.wss.to(
				[...this.gamePlayers[ind].p1SockId,
				 ...this.gamePlayers[ind].p2SockId,
				 ...this.gamePlayers[ind].spectators]
			).emit('recieveCoordSpeedy', {
				ballH: this.ballH[ind],
				ballV: this.ballV[ind],
				leftbarH: this.leftbarH[ind],
				leftbarV: this.leftbarV[ind],
				rightbarH: this.rightbarH[ind],
				rightbarV: this.rightbarV[ind],
				leftScore: this.leftScore[ind],
				rightScore: this.rightScore[ind],
			});
		}, 0.009 * 1000);
	}

	finishGame(ind: number) {

		this.gamesservice.finish_game(this.gamePlayers[ind].gameid,
			this.leftScore[ind],
			this.rightScore[ind]);

		this.gamePlayers[ind].finished = 1;

		// notify player and spectators
		this.wss.to(
			[...this.gamePlayers[ind].p1SockId,
			 ...this.gamePlayers[ind].p2SockId,
			 ...this.gamePlayers[ind].spectators]).emit("gamefinishedSpeedy");
	}


	@SubscribeMessage('playerReadySpeedy')
	handlePlayerReady(client: Socket, ...args: any[]) {


		// initialized game object
		let gp: GameObj = { p1SockId: [], p2SockId: [], gameid: "", spectators: [], finished: 0, started: 0 };


		// if game already saved
		let ind = searchForGame(this.gamePlayers, args[0].gameid);


		// **GET** game if already exists or set id if new
		if (ind === -1)
			gp.gameid = args[0].gameid;
		else
			gp = this.gamePlayers[ind];


		// left player entering
		if (args[0].side == 'left' && !(gp.p1SockId.includes(client.id)))
		gp.p1SockId.push(client.id);

		// right player entering
		if (args[0].side == 'right' && !(gp.p2SockId.includes(client.id)))
		gp.p2SockId.push(client.id);

		// guest watching
		if (args[0].side == 'seat') {
			if (gp.spectators.findIndex((elm: string) => elm == client.id) === -1)
				gp.spectators.push(client.id);
		}


		// **UPDATE** game if already exists or add new one
		if (ind === -1)
			ind = this.gamePlayers.push(gp) - 1;
		else
			this.gamePlayers[ind] = gp;


		// initialize and start game only on
		if (((this.gamePlayers[ind].p1SockId.length == 1 && this.gamePlayers[ind].p2SockId.length > 0) ||
			 (this.gamePlayers[ind].p1SockId.length == 1 && this.gamePlayers[ind].p2SockId.length > 0)) &&
			this.gamePlayers[ind].started == 0) {
			this.initBallnBar(ind);
			this.gamePlayers[ind].started = 1;
			this.startCountdown(ind);
		}


	}

	@SubscribeMessage('moveBarUpSpeedy')
	handleMoveBarUp(client: Socket, ...args: any[]) {


		if (args[0].id === undefined ||
			args[0].side === undefined)
			return;

		let ind = searchForGame(this.gamePlayers, args[0].id);

		//                              additional check for security: same socket of player
		if (args[0].side === 'right' && this.gamePlayers[ind].p2SockId.includes(client.id)) {

			this.rightbarV[ind] -= BARSPEED;

			if (this.rightbarV[ind] < 0)
				this.rightbarV[ind] = 0;
		}

		if (args[0].side === 'left' && this.gamePlayers[ind].p1SockId.includes(client.id)) {

			this.leftbarV[ind] -= BARSPEED;

			if (this.leftbarV[ind] < 0)
				this.leftbarV[ind] = 0;
		}
	}

	@SubscribeMessage('moveBarDownSpeedy')
	handleMoveBarDown(client: Socket, ...args: any[]) {

		if (args[0].id === undefined ||
			args[0].side === undefined)
			return;

		let ind = searchForGame(this.gamePlayers, args[0].id);

		if (ind === -1)
			return;

		if (args[0].side === 'right' && this.gamePlayers[ind].p2SockId.includes(client.id)) {

			this.rightbarV[ind] += BARSPEED;

			if (this.rightbarV[ind] + BARHEIGHT > HEIGHT)
				this.rightbarV[ind] = HEIGHT - BARHEIGHT;
		}

		if (args[0].side === 'left' && this.gamePlayers[ind].p1SockId.includes(client.id)) {

			this.leftbarV[ind] += BARSPEED;

			if (this.leftbarV[ind] + BARHEIGHT > HEIGHT)
				this.leftbarV[ind] = HEIGHT - BARHEIGHT;
		}
	}


	afterInit(server: any) {
	}

	handleConnection(client: Socket, ...args: any[]) {
		// console.log("SERVER: Match client connected", client.id);
	}

	handleDisconnect(client: Socket) {
		// console.log("SERVER: Match client disconnected", client.id);

		// remove disconnected spectator
		this.gamePlayers.forEach((elment, index) => {
			let ind2 = elment.spectators.findIndex((elm) => elm == client.id);
			if (ind2 !== -1)
				this.gamePlayers[index].spectators.splice(ind2, 1);
		});

		// game over if player disconnected every socket

		// search games
		let ind: number = this.gamePlayers.findIndex(
			(elm: any) => elm.p1SockId.includes(client.id) || elm.p2SockId.includes(client.id));


		// diconnected client is not a player!
		if (ind === -1)
			return ;

		let side: string
		if (this.gamePlayers[ind].p1SockId.includes(client.id))
			side = 'l'
		if (this.gamePlayers[ind].p2SockId.includes(client.id))
			side = 'r'

		// game has ended; no more further action is needed
		if (this.gamePlayers[ind].finished === 1)
			return ;

		if (side == 'l' && this.gamePlayers[ind].p1SockId.length == 2)
			return this.gamePlayers[ind].p1SockId.splice(this.gamePlayers[ind].p1SockId.indexOf(client.id));
		if (side == 'r' && this.gamePlayers[ind].p2SockId.length == 2)
			return this.gamePlayers[ind].p2SockId.splice(this.gamePlayers[ind].p2SockId.indexOf(client.id));

		// stop streaming
		clearInterval(this.gameTimers[ind]);
		clearInterval(this.startTimers[ind]);

		// left player quitted
		if (side == 'l') {
			this.leftScore[ind] = 0;
			this.rightScore[ind] = WINSCORE;
		}
		// right player quitted
		if (side == 'r') {
			this.leftScore[ind] = WINSCORE;
			this.rightScore[ind] = 0;
		}

		// finish game
		// and broadcast gameover
		this.finishGame(ind);

		// win for other player
		if (side == 'r') {
			if (this.gamePlayers[ind].p1SockId.length > 0)
				this.wss.to(this.gamePlayers[ind].p1SockId)
					.emit("setTextSpeedy", { message: "WINNER" });
		}
		if (side == 'l') {
			if (this.gamePlayers[ind].p2SockId.length > 0)
				this.wss.to(this.gamePlayers[ind].p2SockId)
					.emit("setTextSpeedy", { message: "WINNER" });
		}

		// game over for spectators
		console.log('SERVER: Sending GAME OVER to ', this.gamePlayers[ind].spectators);

		if (this.gamePlayers[ind].spectators.length > 0)
			this.wss.to(this.gamePlayers[ind].spectators)
				.emit("setTextSpeedy", { message: "GAME OVER" });
	}
}