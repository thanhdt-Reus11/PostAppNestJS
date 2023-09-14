import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, UnauthorizedException } from "@nestjs/common";
import { WsBadRequestException, WsUnauthorizedException, WsUnknownException } from "./ws-exception";
import { SocketWithAuth } from "src/common/types/payload.type";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    
    catch(exception: Error, host: ArgumentsHost): void {
        const socket: SocketWithAuth = host.switchToWs().getClient();

        if (exception instanceof BadRequestException) {
            const exceptionData = exception.getResponse();

            const exceptionMessage = exceptionData['message'] ?? exceptionData ?? exception.name;

            const wsException = new WsBadRequestException(exceptionMessage);
            socket.emit('exception', wsException.getError());
            return;
        }
        else if (exception instanceof UnauthorizedException) {
            const exceptionData = exception.getResponse();

            const exceptionMessage = exceptionData['message'] ?? exceptionData ?? exception.name;

            const wsException = new WsUnauthorizedException(exceptionMessage);
            socket.emit('exception', wsException.getError());
            return;
        }

        
        const wsException = new WsUnknownException(exception.message);
        socket.emit('exception', wsException.getError());
    }
}