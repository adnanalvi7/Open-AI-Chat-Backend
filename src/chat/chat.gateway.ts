import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OpenAIService } from 'src/openai/openai.service';
import { RedisClientService } from 'src/redis-client/redis-client.service';

@WebSocketGateway(Number(process.env.SOCKET_PORT), {
  cors: {
    origin: '*', // Allow all origins, or specify the frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private MAX_MESSAGES = Number(process.env.MAX_MESSAGES_LIMIT);
  constructor(
    private readonly openAiService: OpenAIService,
    private readonly redisService: RedisClientService,
        private readonly jwtService: JwtService,
    
  ) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const isLoggedIn = this.isUserLoggedIn(client);
    const ipAddress = this.getUserIpAddress(client); // For now i am getting the ip from the client because on the same machine i am not able to get ip address in the request

    if(!ipAddress){
      this.server
          .to(client.id)
          .emit('message',{success:false, message:'You are not authorized. Please log in.'});
        return;
    }
    if (!isLoggedIn) {
      const count = await this.redisService.getCount(ipAddress);
      if (count >= this.MAX_MESSAGES) {
        this.server
          .to(client.id)
          .emit('message', {success:false, message:'You are not authorized. Please log in.'});
        return;
      }
      await this.redisService.incrementCount(ipAddress);
    }

    const response_message=await this.openAiService.generateText(message)
    this.server.emit('message', {success:true, message:response_message});
  }

  async handleConnection(client: Socket) {
    const forwarded = client.handshake;
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  private isUserLoggedIn(client: Socket): boolean {
    try {
      const token = client.handshake.auth?.token;
      if (!token) return false; // No token provided

      const decoded = this.jwtService.decode(token, { complete: true });
      if (!decoded || typeof decoded !== "object") return false; // Ensure decoded data is valid

      return !!decoded.payload; // Returns user info stored in token payload
  } catch (error) {
      console.error("Error decoding token:", error.message);
      return false;
  }
}

  private getUserIpAddress(client: Socket): string {
    return client.handshake.auth?.ipAddress || '';
  }
}
