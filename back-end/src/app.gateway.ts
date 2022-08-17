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
import { UsersService } from './users/users.service';
  
  @WebSocketGateway({
	  cors: {
		  origin: "*"
	  }
  })
  export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
	@WebSocketServer() wss: Server;

	constructor(
		private readonly roomsService: RoomsService,
		private readonly usersService: UsersService
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

	@SubscribeMessage('InteractUsers')
	async handleInteractUser(client: Socket, message: {user1: number, user2: number, interaction: string}): Promise<any> {

		/* 
			1- Check which interaction is required.
			2- Check if the user has the permission to perform the action on the target.
		*/
		this.logger.log(`User ${message.user1} ${message.interaction}ed ${message.user2}`);
		if (message.interaction == "mute")
		{
			
			// let 
		}
	//   client.broadcast.emit('msgToClient', text); // the client doesn't receive it
		// this.wss.to(client.id).emit('msgToClient', `Received ${text}`);
	//   return { event: 'msgToClient', data: text };
	}


	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, message: {userID: number, room: string}): void {
		//TODO: check if room is protected and if user is not banned etc...
		client.join(message.room);
		client.emit('joinedRoom', message.room);
	}

	@SubscribeMessage('msgToClientDM')
	async handleDmMessage(client: Socket, message: {text: string, room: string, username: string}): Promise<any> {
		// Add logic before sending a message here
		/* 
			1- Check if the receiver is muted/blocked by the sender
		*/
		let usr = await this.usersService.find_username(message.username);
		client.broadcast.to(message.room).emit(message.text);
	}

  }	