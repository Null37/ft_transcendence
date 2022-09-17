import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { GamesService } from "./games/games.service";
import { UsersService } from "./users/users.service";

@WebSocketGateway({
	cors: { origin: "*" },
	namespace: "/game"
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection{
	@WebSocketServer() wss: Server;

	constructor(
		private readonly gamesservice: GamesService,
		private readonly userservice: UsersService,
	){}
	private queuePlayers: Array<{ sockId: string, token: any; }> = [];

	afterInit(server: any) {
		console.log("SERVER: Game Web Socket initialized!");
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log("SERVER: Game client connected", client.id);
	}
	handleDisconnect(client: Socket) {
		console.log("SERVER: Game client disconnected", client.id);

		// pop from QUEUE PLAYERS
		let ind: number = this.queuePlayers.findIndex((elm: any) => elm.sockId == client.id);
		if (ind !== -1) {
			this.queuePlayers.splice(ind, 1);
		}
	}


	@SubscribeMessage('cancelQueue')
	handleCancelQueue(client: Socket) {
		console.log('SERVER: Game client wanted to leave the queue');

		let ind = this.queuePlayers.findIndex((elm: any) => elm.sockId == client.id );
		if (ind != -1)
			this.queuePlayers.splice(ind,1);
		console.log("SERVER: TOTAL QUEUE PLAYERS NOW", this.queuePlayers.length);
	}


	@SubscribeMessage('joinQueue')
	async handleJoinQueue(client: Socket) {
		console.log("SERVER: GOT REQUEST TO JOIN");

		let tkn = JSON.parse(Buffer.from(client.handshake.headers.authorization.split('.')[1], 'base64').toString('utf8'));


		console.log("SERVER: Game client joined the queue", client.id);

		// user already joined
		// update socket
		let ind = this.queuePlayers.findIndex((elm: any) => elm.token.sub == tkn.sub );
		if (ind !== -1) {
			this.queuePlayers[ind].sockId = client.id;
		}

		// socket already joined
		if (this.queuePlayers.findIndex((elm: any) => elm.sockId == client.id ) === -1)
			{ this.queuePlayers.push({ sockId: client.id, token: tkn }); }

		console.log("SERVER: TOTAL QUEUE PLAYERS", this.queuePlayers.length);

		if (this.queuePlayers.length >= 2) {

			let usr1 = await this.userservice.findOne(this.queuePlayers[0].token.name);
			let usr2 = await this.userservice.findOne(this.queuePlayers[1].token.name);

			let new_game_id = await this.gamesservice.startGame(usr1, usr2);

			// this.gamesservice.getAll().then(res => console.table('GAMES HERE', res) );

			this.wss.to([this.queuePlayers[0].sockId, this.queuePlayers[1].sockId]).emit('queueResponse', new_game_id);

			this.queuePlayers.splice(0, 2);
		}

		console.log(this.queuePlayers);
	}
} 