import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { GamesService } from "./games/games.service";
import { UsersService } from "./users/users.service";

interface GameObj {
    p1SockId: string,
	p2SockId: string,
	gameid: string,
	spectators: string[],
}

const searchForGame = (gp: GameObj[], gid: string) => {

	let ind: number = gp.findIndex(
		(elm: any) => elm.gameid == gid);
	return ind;
}

const HEIGHT: number = 600;
const WIDTH: number = 800;
const BARWIDTH: number = 20;
const BARHEIGHT: number = 80;
const BARSPEED: number = 4;

const BALLRADIUS: number = 20;
var HBALLSPEED: number = 4;
var VBALLSPEED: number = -4;

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

	// private string gameuid;
	private gamePlayers: Array<GameObj> = [];

	private ballH: Array<number> = [];
	private ballV: Array<number> = [];

	private leftbarH: Array<number> = [];
	private leftbarV: Array<number> = [];

	private rightbarH: Array<number> = [];
	private rightbarV: Array<number> = [];

	initBallnBar(ind) {

		this.ballH[ind] = WIDTH/2;
		this.ballV[ind] = HEIGHT/2;

		this.leftbarH[ind] = 0;
		this.leftbarV[ind] = HEIGHT/2 - BARHEIGHT / 2;

		this.rightbarH[ind] = WIDTH - BARWIDTH;
		this.rightbarV[ind] = HEIGHT/2 - BARHEIGHT / 2;
	}

	startGame(ind: number) {

		let a = setInterval(() => {

			this.ballH[ind] += HBALLSPEED;
			this.ballV[ind] += VBALLSPEED;
			if (this.ballH[ind] <= BARWIDTH || this.ballH[ind] >= WIDTH - BARWIDTH) 
			{
				HBALLSPEED *= -1;

				// left goal
				if(this.ballH[ind] - BALLRADIUS/2 < BARWIDTH && (this.ballV[ind] < this.leftbarV[ind] || this.ballV[ind] > this.leftbarV[ind] + BARHEIGHT))
				{
					// score for p2
					this.initBallnBar(ind);
				}

				// right goal
				if (this.ballH[ind] + BALLRADIUS/2 > WIDTH - BARWIDTH && (this.ballV[ind] < this.rightbarV[ind] || this.ballV[ind] > this.rightbarV[ind] + BARHEIGHT))
				{
					// score for p1
					this.initBallnBar(ind);
				}
			}

			if (this.ballV[ind] - BALLRADIUS/2 < 0 || this.ballV[ind] + BALLRADIUS/2 > HEIGHT)
				VBALLSPEED *= -1;
		}, 0.05 * 1000);

		clearInterval(a);

		// should save return to stop interval
		setInterval(() => {

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
			});
		}, 0.05 * 1000); // each
	}

	afterInit(server: any) {
		// console.log("SERVER: Match Web Socket initialized!");
	}

	handleConnection(client: Socket, ...args: any[]) {
	}

	handleDisconnect(client: Socket) {
		// game over if player disconnects
	}


	@SubscribeMessage('playerReady')
	handlePlayerReady(client: Socket, ...args: any[]) {


		// initialized game object
		let gp: GameObj = { p1SockId: "", p2SockId: "", gameid: "", spectators: [], };


		// if game already saved
		let ind = searchForGame(this.gamePlayers, args[0].gameid);


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
			this.gamePlayers.push(gp);
		else
			this.gamePlayers[ind] = gp;


		if (args[0].side == 'left' || args[0].side == 'right') {

			if (ind === -1)
				ind = this.gamePlayers.length - 1;
			// this.wss.
			this.initBallnBar(ind);
			this.startGame(ind);
		}


		console.log(ind, this.gamePlayers);
	}

	@SubscribeMessage('moveBarUp')
	handleMoveBarUp(client: Socket, ...args: any[]) {

		console.log('SERVER: GOT REQUEST TO MOVE BAR UP', args);

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

		console.log('SERVER: GOT REQUEST TO MOVE BAR DOWN', args);

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


	@SubscribeMessage('ping')
	handlePing(client: Socket) {

		console.log('SERVER: GOT PING FROM MATCH CLIENT');
		this.wss.to(client.id).emit('pingResponse');
	}

	@SubscribeMessage('loop')
	handleLoop(client: Socket) {

		console.log('SERVER: GOT LOOP REQUEST FROM MATCH CLIENT');
		// while (1)
			this.wss.emit('loopResponse');
	}
}