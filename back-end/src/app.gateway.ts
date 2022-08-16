import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketServer} from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Socket, Server } from 'socket.io';
import { RoomsService } from './rooms/rooms.service';
  
  @WebSocketGateway({
	  cors: {
		  origin: "*"
	  }
  })
  export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
	@WebSocketServer() wss: Server;

	constructor(
		private readonly roomsService: RoomsService
	){}
	private logger: Logger = new Logger('AppGateway');
  
	afterInit(server: Server) {
	  this.logger.log('Initialized!');
	}
  
	handleDisconnect(client: Socket) {
	  this.logger.log(`Client disconnected: ${client.id}`);
	}
  
	handleConnection(client: Socket, ...args: any[]) {
	  this.logger.log(`Client connected:    ${client.id}`);
	}
	/* ====================================================================================================== */
	/* ====================================================================================================== */
	/* ====================================================================================================== */
	// @SubscribeMessage('userJoinedChat')
	// joinChatRoom(client: Socket): void {
	// 	this.logger.log(`A user joined this chat room`);
	// }
	// @SubscribeMessage('msgToServer') 
	// handleMessage(client: Socket, text: string): WsResponse<string> {
	//   this.logger.log(`Received message from: ${client.id}, content: ${text}`);
	// //   this.wss.emit('msgToClient', text);
	//   return { event: 'msgToClient', data: text };
	// }

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, text: string): void {
	  this.logger.log(`Received message from: ${client.id}, content: ${text}`);
	//   client.broadcast.emit('msgToClient', text); // the client doesn't receive it
		this.wss.to(client.id).emit('msgToClient', `Received ${text}`);
	//   return { event: 'msgToClient', data: text };
	}


	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, message: {userID: number, room: string}): void {
		//TODO: check if room is protected and if user is not banned etc...
		client.join(message.room);
		client.emit('joinedRoom', message.room);
	}
	@SubscribeMessage('msgToClientDM')
	handleDmMessage(client: Socket, text: string, room: string): void {
		// Add logic before sending a message here
		client.broadcast.to(room).emit(text);
	}

  }	