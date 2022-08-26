import { OnGatewayConnection, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";


@WebSocketGateway({
	cors: {
		origin: "*"
	},
	namespace: "/test"
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection{
	@WebSocketServer() wss: Server;
	
	
	afterInit(server: any) {
		console.log("test here reached")
	}
	
	handleConnection(client: any, ...args: any[]) {
		console.log("test here reached")
	}

}