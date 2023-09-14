import { OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, WsException, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { PostService } from "./post.service";
import { BadGatewayException, BadRequestException, ForbiddenException, Logger, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { Namespace } from "socket.io";
import { SocketWithAuth } from "src/common/types/payload.type";
import { WsBadRequestException } from "src/exceptions/ws-exception";
import { AllExceptionFilter } from "src/exceptions/ws-catch-all-filter";


@UseFilters(AllExceptionFilter)
@WebSocketGateway({
    namespace: 'posts',
})
export class PostGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PostGateWay.name);
  constructor(private readonly postsService: PostService) {}

  @WebSocketServer() io: Namespace;

  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `Socket connected with userID: ${client.id}, pollID: ${client.email}, and name: "${client.role}"`,
    );

    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    this.io.emit('hello', `from ${client.id}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `Socket connected with userID: ${client.id}, pollID: ${client.id}, and name: "${client.role}"`,
    );

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    // TODO - remove client from poll and send `participants_updated` event to remaining clients
  }

  @SubscribeMessage('message')
  async handleMessage() {
    console.log('Message received!');
    throw new BadGatewayException('Idiot Request');
  }
}