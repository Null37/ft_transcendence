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
import * as bcrypt from 'bcrypt';
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
  
	async handleDisconnect(client: Socket) {

		/* 
			1- find the socket id
			2- remove it
			3- if array is empty broadcast to all users status update
		*/
	  let usrs = await this.usersService.findAll();
	  for (let i = 0; i < usrs.length; i++)
	  {
		  if (usrs[i].socket_savier.includes(client.id))
		  {
			  usrs[i].socket_savier.splice(usrs[i].socket_savier.indexOf(client.id), 1)
			  if (usrs[i].socket_savier.length == 0)
			  {
				if (usrs[i].inGamesock.length !== 0)
				{
					usrs[i].status = "In-Game";
					this.wss.emit('statusChanged', {debug: "socket disconnect", username: usrs[i].username, status: "In-Game"});
				}
				else
				{
					usrs[i].status = "offline";
					this.wss.emit('statusChanged', {debug: "socket disconnect", username: usrs[i].username, status: "offline"});
				}
			}
		}
		else if (usrs[i].inGamesock.includes(client.id))
		{
			usrs[i].inGamesock.splice(usrs[i].inGamesock.indexOf(client.id), 1)
			if (usrs[i].inGamesock.length == 0)
			{
				if (usrs[i].socket_savier.length !== 0)
				{
					this.wss.emit('statusChanged', {debug: "socket disconnect", username: usrs[i].username, status: "Online"});
					usrs[i].status = "Online";
				}
				else
				{
					this.wss.emit('statusChanged', {debug: "socket disconnect", username: usrs[i].username, status: "offline"});
					usrs[i].status = "offline";
				}
			}
		}
		await this.usersService.update(usrs[i]) // probably should be inside the if statement but i'm lazy to test it now
	  }
	//   this.wss.emit('statusChanged', {debug: "socket disconnect", username: "placeholder", status: "offline"});




	//   const token = client.handshake.headers.authorization;
	//   var base64Url = token.split('.')[1];
	//   var base64 = base64Url.replace('-', '+').replace('_', '/');






	}

	@SubscribeMessage('clearGame')
	async clearGame(client: Socket, token: any)
	{

		var base64Url = token.split('.')[1];
		if (base64Url)
		{
			var base64 = base64Url.replace('-', '+').replace('_', '/');
			if (base64)
			{
				const tmp = JSON.parse(atob(base64));

				if (tmp.name.length > 15)
					return ;
				const usr = await this.usersService.findOne(tmp.name)
		
				// let usr = await this.usersService.find_username(username);
		
				if (usr)
				{
						usr.status =  "Online";
						usr.inGamesock = []
						usr.socket_savier.includes(client.id) ? usr.socket_savier.splice(usr.socket_savier.indexOf(client.id), 1) : null // remove socket from Online
					// usr.socket_savier.push(client.id)
					await this.usersService.update(usr)
				}
				this.wss.emit('statusChanged',  {debug: "socket connect", username: usr.username, status: "Online"})
			}
		}
	}
	@SubscribeMessage('disconnectUser')
	async disconnectUser(client: Socket, username: string): Promise<any> {
		this.logger.log(`Disconect userdisconnected: ${client.id}`);
		if (username.length > 15)
			return ;
		const user = await this.usersService.find_username(username)
		if (user)
		{
			user.status = "offline";
			user.socket_savier = []
			user.inGamesock = []
			await this.usersService.update(user)
			this.wss.emit('statusChanged', {debug: "sDisconect userdisconnected", username: user.username, status: "offline"});
		}
		// let usrs = await this.usersService.findAll();
		// for (let i = 0; i < usrs.length; i++)
		// {
		//   if (usrs[i].socket_savier.includes(client.id))
		//   {
		// 	  usrs[i].socket_savier.splice(usrs[i].socket_savier.indexOf(client.id), 1)
		// 	  if (usrs[i].socket_savier.length == 0)
		// 	  {
		// 		  usrs[i].status = "offline";
		// 		  this.wss.emit('statusChanged', {debug: "socket disconnect", username: usrs[i].username, status: "offline"});
		// 	  }
		//   }
		//   else if (usrs[i].inGamesock.includes(client.id))
		//   {
		// 	  usrs[i].inGamesock.splice(usrs[i].inGamesock.indexOf(client.id), 1)
		// 	  if (usrs[i].inGamesock.length == 0)
		// 	  {
		// 		  if (usrs[i].socket_savier.length !== 0)
		// 		  {
		// 			  this.wss.emit('statusChanged', {debug: "socket disconnect", username: usrs[i].username, status: "Online"});
		// 			  usrs[i].status = "Online";
		// 		  }
		// 		  else
		// 		  {
		// 			  this.wss.emit('statusChanged', {debug: "socket disconnect", username: usrs[i].username, status: "offline"});
		// 			  usrs[i].status = "offline";
		// 		  }
		// 	  }
		//   }
		//   await this.usersService.update(usrs[i]) // probably should be inside the if statement but i'm lazy to test it now
		// }
	}

	async handleConnection(client: Socket, ...args: any[]) {
	  this.logger.log(`Client connected:    ${client}`);
	  const token = client.handshake.headers.authorization;
	  if (token)
	  {
		  var base64Url = token.split('.')[1];
		  if (base64Url)
		  {
			  var base64 = base64Url.replace('-', '+').replace('_', '/');
			  const tmp = JSON.parse(atob(base64));
			  const user = await this.usersService.findOne(tmp.name)
			  if (user)
			  {
				if (user.status !== "In-Game")
				{
					user.status = "Online";
					user.socket_savier.includes(client.id) ? null : user.socket_savier.push(client.id) // add socket in case of Online only (game socket is added in the inGamesock)
				}
					
			  }
		  }
	  }
	}

	@SubscribeMessage('connectUser')
	async handleConnectuser(client: Socket, ...username: any)
	{
		/* 
			1- check if the user exists in the data base
			2- change status to Online if the old status is not "game"
			3- 
		*/
		// let usr = await this.usersService.find_username("boodeer");
		if (username[0]?.username.length > 15)
			return ;
		// if (label?.length > 15)
		// 	return ;
		
		let usr = await this.usersService.find_username(username[0].username);
		if (usr)
		{
			if (username[0].label != "In-Game")
			{
				if (usr.status !== "In-Game")
					usr.status = username[0].label;
				usr.socket_savier.includes(client.id) ? null : usr.socket_savier.push(client.id) // add socket in case of Online only (game socket is added in the inGamesock)
			}
			else if (username[0].label == "In-Game")
			{
				usr.status = username[0].label;
				usr.inGamesock.includes(client.id) ? null : usr.inGamesock.push(client.id) // add socket in case of Online only (game socket is added in the inGamesock)
			}
			// usr.socket_savier.push(client.id)
			await this.usersService.update(usr)
			if (usr.status != "In-Game")
				this.wss.emit('statusChanged',  {debug: "socket connect", username: usr.username, status: "Online"})
			else
			this.wss.emit('statusChanged',  {debug: "socket connect", username: usr.username, status: "In-Game"})
		}

	}



	@SubscribeMessage('connectUserGame')
	async handleConnectuserGame(client: Socket, ...token: any[])
	{

		var base64Url = token[0].token.split('.')[1];
		if (base64Url)
		{
			var base64 = base64Url.replace('-', '+').replace('_', '/');
			if (base64)
			{
				const tmp = JSON.parse(atob(base64));
				if (tmp.name.length > 15)
					return ;
				const usr = await this.usersService.findOne(tmp.name)
		
				// let usr = await this.usersService.find_username(username);
		
				if (usr)
				{
						usr.status =  "In-Game";
						usr.inGamesock.includes(client.id) ? null : usr.inGamesock.push(client.id) // add socket in case of Online only (game socket is added in the inGamesock)
						usr.socket_savier.includes(client.id) ? usr.socket_savier.splice(usr.socket_savier.indexOf(client.id), 1) : null // remove socket from Online
					// usr.socket_savier.push(client.id)
					await this.usersService.update(usr)
				}
				this.wss.emit('statusChanged',  {debug: "socket connect", username: usr.username, status: "In-Game", gameID: token[0].GameId})
			}
		}
	}












	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, text: string): void {
	  this.logger.log(`Received message from: ${client.id}, content: ${text}`);
	//   client.broadcast.emit('msgToClient', text); // the client doesn't receive it
		if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(text))
			return ;
		this.wss.to(client.id).emit('msgToClient', `Received ${text}`);
	//   return { event: 'msgToClient', data: text };
	}

	// deprecated
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
		// usr2.duration = Date.now() +  message.duration;
		await this.roomsService.roomUser.save(usr2);
		if (message.interaction == "ban")
			client.broadcast.to(message.roomName).emit('leaveRoom', message.user2) // must be checked in the front end to kick the banned user.
	}


	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, room: string): void {
		//TODO: check if room is protected and if user is not banned etc...
		client.join(room);
		// client.emit('joinedRoom', message.room);
	}

	/* 
		The userID will be deleted from the database when leaving the room and it will
		broadcast the userID to update other users front-end
	*/
	@SubscribeMessage('leaveRoom')
	async handleLeaveRoom(client: Socket, room: string): Promise<any> {
		//TODO: check if room is protected and if user is not banned etc...
		// this.roomsService.
		client.leave(room);
		//TODO Delete the user from UsersRoom table.
		// let usrs = await this.roomsService.roomUser.find({where: {roomName: room}})

		const token = client.handshake.headers.authorization;
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		let usr = await this.usersService.find_username(JSON.parse(atob(base64)).username);
		await this .roomsService.roomUser.delete({roomName: room, userID: usr.id})
		// client.broadcast.to(room).emit('leaveRoom', userID);
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
		
		let tmp = await this.blockService.find_blocked(message.receiver, message.sender)

		// tmp.id 

		let userProfile = await this.usersService.findbyId(message.sender)
		// if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(message.text))
		// 	return ;
		if (tmp == null)
		{
			client.broadcast.to(message.room).emit('msgToClient',
			{
				roomName: message.room,
				state: "DM",
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
		// {text: this.placeHolder, room: this.currentRoom, userID: this.me[0].id}

		this.logger.log(`received a message: ${message.text} from ${client.id} will be sent to ${message.room}`)
		let usr = await this.roomsService.roomUser.findOne({where: {userID: message.userID, roomName: message.room}})
		if (!usr)
			return ;

		if ((usr.status == 1 && +usr.duration > Date.now()))
		{
			return ;
		}
		if (message.text.split(" ")[0] == "/leave")
		{
			if (usr)
			{
				await this.roomsService.roomUser.delete({roomName: message.room, userID: message.userID})
				client.leave(message.room)
				let tmp69 = await this.usersService.findbyId(message.userID)
				// add new logic to leave room if empty (deleted)
				let roomnb = await this.roomsService.roomUser.find({where: {roomName: message.room}})
				if (roomnb.length == 0)
					await this.roomsService.rooms.delete({roomName: message.room})
				this.wss.to(message.room).emit('leaveRoom', tmp69.username, message.room);
				return ;
			}
		}
		if (message.text.startsWith("/changepassword ") && (usr.role == "moderator" || usr.role == "mod"))
		{
			let arr = message.text.split(' ');
			let findRoom = await this.roomsService.rooms.findOne({where: {roomName: message.room}})
			if (findRoom) //! To be checked
			{
				if (arr.length > 1 && arr[1].length)
				{
					findRoom.password =  await bcrypt.hash(arr[1], 10);
					findRoom.state = 1;
				}
				else
				{
					findRoom.password = "";
					findRoom.state = 0;
				}
			}
			await this.roomsService.rooms.save(findRoom)
			return ;
		}
		else if (message.text.startsWith("/admin ") && (usr.role == "moderator" || usr.role == "mod"))
		{
			let arr = message.text.split(' ');
			let res = await this.usersService.find_username(arr[1])
			let foo = await this.roomsService.roomUser.findOneOrFail({where: {userID: res.id, roomName: message.room}})
			foo.role = "admin"
			await this.roomsService.roomUser.save(foo)
			return ;
		}
		else if (message.text.startsWith("/ban ") || message.text.startsWith("/mute "))
		{
			if (usr.role == "user")
				return ;

			let arr = message.text.split(' ');
			if (arr.length != 3)
				return ;
			let valid = /^[0-9]+$/.test(arr[2]) ? +arr[2] : -1;
			if (valid == -1)
				return ;
	
			try {
				let res = await this.usersService.find_username(arr[1])
				if (!res)
					return ;
				let foo = await this.roomsService.roomUser.findOneOrFail({where: {userID: res.id, roomName: message.room}})
				if (foo.role == "mod" || foo.role == "moderator")
					return ;
				foo.duration = (Date.now() + (valid * 1000)).toString();
				foo.status = arr[0] == "/ban" ? 2 : 1;
				let username = await this.usersService.findbyId(res.id)
				await this.roomsService.roomUser.save(foo);

				//! add ban socket emit here
				if (arr[0] == "/ban")
				{
					this.wss.to(message.room).emit('leaveRoom', username.username, message.room);
					// await this .roomsService.roomUser.delete({roomName: message.room, userID: res.id})
				}
			} catch (error) {
			}
			return ;
		}

		let userProfile = await this.usersService.findbyId(message.userID)

		if (message.text.startsWith("/"))
			return ;
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