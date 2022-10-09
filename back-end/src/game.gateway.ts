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
	private queueSpeedyPlayers: Array<{ sockId: string, token: any; }> = [];

	afterInit(server: any) {
	}

	handleConnection(client: Socket, ...args: any[]) {
	}
	handleDisconnect(client: Socket) {

		// pop from QUEUE PLAYERS
		let ind1: number = this.queuePlayers.findIndex((elm: any) => elm.sockId == client.id);
		if (ind1 !== -1) {
			this.queuePlayers.splice(ind1, 1);
		}

		// pop from QUEUE PLAYERS
		let ind2: number = this.queueSpeedyPlayers.findIndex((elm: any) => elm.sockId == client.id);
		if (ind2 !== -1) {
			this.queueSpeedyPlayers.splice(ind2, 1);
		}
	}


	@SubscribeMessage('cancelQueue')
	handleCancelQueue(client: Socket) {

		let ind = this.queuePlayers.findIndex((elm: any) => elm.sockId == client.id );
		if (ind != -1)
			this.queuePlayers.splice(ind,1);
	}


	@SubscribeMessage('joinQueue')
	async handleJoinQueue(client: Socket, ...args: any[]) {

		if (!args || !args[0] || !args[0].token)
			return ;

		console.log(args[0].token, 'TOKEN ARRIVED');

		let tkn = JSON.parse(Buffer.from(args[0].token.split('.')[1], 'base64').toString('utf8'));


		// user already joined
		// update socket
		let ind = this.queuePlayers.findIndex((elm: any) => elm.token.sub == tkn.sub );
		if (ind !== -1) {
			this.queuePlayers[ind].sockId = client.id;
		}

		// socket already joined
		if (this.queuePlayers.findIndex((elm: any) => elm.sockId == client.id ) === -1)
			{ this.queuePlayers.push({ sockId: client.id, token: tkn }); }


		if (this.queuePlayers.length >= 2) {

			let usr1 = await this.userservice.findOne(this.queuePlayers[0].token.name);
			let usr2 = await this.userservice.findOne(this.queuePlayers[1].token.name);

			let new_game_id = await this.gamesservice.startGame(usr1, usr2);

			// this.gamesservice.getAll().then(res => console.table('GAMES HERE', res) );

			this.wss.to([this.queuePlayers[0].sockId, this.queuePlayers[1].sockId]).emit('queueResponse', new_game_id);

			this.queuePlayers.splice(0, 2);
		}
	}


	@SubscribeMessage('cancelSpeedyQueue')
	handleCancelSpeedyQueue(client: Socket, ...args: any[]) {

		let ind = this.queueSpeedyPlayers.findIndex((elm: any) => elm.sockId == client.id );
		if (ind != -1)
			this.queueSpeedyPlayers.splice(ind,1);
		// console.log("SERVER: TOTAL QUEUE PLAYERS NOW", this.queueSpeedyPlayers.length);
	}


	@SubscribeMessage('joinSpeedyQueue')
	async handleJoinSpeedyQueue(client: Socket, ...args: any[]) {

		if (!args || !args[0] || !args[0].token)
			return ;

		let tkn = JSON.parse(Buffer.from(args[0].token.split('.')[1], 'base64').toString('utf8'));


		// user already joined
		// update socket
		let ind = this.queueSpeedyPlayers.findIndex((elm: any) => elm.token.sub == tkn.sub );
		if (ind !== -1) {
			this.queueSpeedyPlayers[ind].sockId = client.id;
		}

		// socket already joined
		if (this.queueSpeedyPlayers.findIndex((elm: any) => elm.sockId == client.id ) === -1)
			{ this.queueSpeedyPlayers.push({ sockId: client.id, token: tkn }); }

		if (this.queueSpeedyPlayers.length >= 2) {
			console.log("SERVER: Good");

			let usr1 = await this.userservice.findOne(this.queueSpeedyPlayers[0].token.name);
			let usr2 = await this.userservice.findOne(this.queueSpeedyPlayers[1].token.name);

			let new_game_id = await this.gamesservice.startGame(usr1, usr2, 2);

			console.log('SENDING TO', [this.queueSpeedyPlayers[0].sockId, this.queueSpeedyPlayers[1].sockId]);

			this.wss.to([this.queueSpeedyPlayers[0].sockId, this.queueSpeedyPlayers[1].sockId]).emit('queueSpeedyResponse', new_game_id);

			this.queueSpeedyPlayers.splice(0, 2);
		}
	}
} 