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
import { blockService } from './users/block.service';
  
  @WebSocketGateway({
	  cors: {
		  origin: "*"
	  }
  })
  export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
	@WebSocketServer() wss: Server;
	
	constructor(
		private readonly roomsService: RoomsService,
		private readonly usersService: UsersService,
		private readonly blockService: blockService
	){}
	private logger: Logger = new Logger('AppGateway');
  
	afterInit(server: Server) {
	  this.logger.log('Initialized!');
	}
  
	handleDisconnect(client: Socket) {
	  this.logger.log(`Client disconnected: ${client.id}`);
	}
  
	handleConnection(client: Socket, ...args: any[]) {
	//   this.logger.log(`Client connected:    ${client}`);
	//   console.log(`Client connected:    ${client.}`);
	}


















	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, text: string): void {
	  this.logger.log(`Received message from: ${client.id}, content: ${text}`);
	//   client.broadcast.emit('msgToClient', text); // the client doesn't receive it
		this.wss.to(client.id).emit('msgToClient', `Received ${text}`);
	//   return { event: 'msgToClient', data: text };
	}

	@SubscribeMessage('InteractUsers')
	async handleInteractUser(client: Socket, message: {user1: number, user2: number, interaction: string, duration: number, roomName: string}): Promise<any> {

		/*
			*interactions = ["mute", "ban"]


			1- Check which interaction is required.
			2- Check if the user has the permission to perform the action on the target.
		*/

		this.logger.log(`User ${message.user1} ${message.interaction}ed ${message.user2}`);
		
		let usr1 = await this.roomsService.roomUser.findOne({where: {userID: message.user1, roomName: message.roomName}})
		let usr2 = await this.roomsService.roomUser.findOne({where: {userID: message.user2, roomName: message.roomName}})
		
		
		if (usr2.role == "moderator" || usr1.role == "user" || (usr1.role == "admin" && usr2.role != "user"))
			return ;

		usr2.role = message.interaction;
		usr2.duration = Date.now() +  message.duration;
		await this.roomsService.roomUser.save(usr2);
		if (message.interaction == "ban")
			client.broadcast.to(message.roomName).emit('leaveRoom', message.user2) // must be checked in the front end to kick the banned user.
	}


	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, message: {userID: number, room: string}): void {
		//TODO: check if room is protected and if user is not banned etc...
		client.join(message.room);
		// client.emit('joinedRoom', message.room);
	}

	/* 
		The userID will be deleted from the database when leaving the room and it will
		broadcast the userID to update other users front-end
	*/
	@SubscribeMessage('leaveRoom')
	handleLeaveRoom(client: Socket, message: {userID: number, room: string}): void {
		//TODO: check if room is protected and if user is not banned etc...
		// this.roomsService.
		client.leave(message.room);
		//TODO Delete the user from UsersRoom table.

		client.broadcast.to(message.room).emit('leaveRoom', message.userID);
	}

	@SubscribeMessage('joinDM')
	handleJoinDM(client: Socket, roomName: string): void
	{
		this.logger.log(`${client.id} joined ${roomName}`)
		client.join(roomName);
	}

	@SubscribeMessage('msgToClientDM')
	async handleDmMessage(client: Socket, message: {text: string, room: string, sender: number, receiver: number}): Promise<any> {
		// Add logic before sending a message here
		/* 
			1- Check if the receiver is muted/blocked by the sender
		*/
		// let usr = await this.	usersService.find_username(message.username);
		// if (usr.)
		
		// this.logger.log(`received a message: ${message.text} from ${client.id} will be sent to ${message.room}`)
		
		// console.log(message)
		let tmp = await this.blockService.find_blocked(message.receiver, message.sender)
		// console.log("blocked list ", tmp, " userID: ", message.receiver, "===>", message.sender);

		// tmp.id 

		let userProfile = await this.usersService.findbyId(message.receiver)
		if (tmp == null)
		{
			client.broadcast.to(message.room).emit('msgToClient',
			{
				roomName: message.room,
				state: "DM",
				blockedUsers: null,
				message: message.text,
				sender: userProfile
			});
		}
		else
		{
			this.wss.to(client.id).emit('msgToClient',
			{
				roomName: message.room,
				state: "DM",
				message: `This user blocked you`,
				sender: userProfile
			});			
		}
	}

	@SubscribeMessage('msgToRoom')
	async handleRoomMessage(client: Socket, message: {text: string, room: string, userID: number}): Promise<any> {
		// Add logic before sending a message here
		/* 
			1- Check if the receiver is muted/banned in the room
		*/
		
		this.logger.log(`received a message: ${message.text} from ${client.id} will be sent to ${message.room}`)
		
		console.log(message)
		// let tmp = await this.blockService.find_blocked(2, 11)
		// console.log("blocked list ", tmp, " userID: ", message.userID);

		// tmp.id 

		let userProfile = await this.usersService.findbyId(message.userID)

		
		client.broadcast.to(message.room).emit('msgToRoom',
		{
			roomName: message.room,
			state: "ROOM",
			message: message.text,
			sender: userProfile
		});
	}

  }	

  /* 
  
  {
	roomName: string,
	state: string, // DM or ROOM
	blockedUsers: [] string, // null in the case of dm else array of blocked users in the roommsgToClient
	message: string,
	sender: {} // send user object (avtar, name)
  }
  */