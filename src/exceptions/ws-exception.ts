import { WsException } from "@nestjs/websockets";

export type WsExceptionTypes = 'BadRequest' | 'Unauthorized' | 'Unknown';


export class WsTypesException extends WsException {
    readonly type : WsExceptionTypes;

    constructor( type: WsExceptionTypes, message: string | unknown) {
        const error = {
            type,
            message
        };

        super(error);
        error.type = type;
    }
}


export class WsBadRequestException extends WsTypesException {
    constructor(message: string | unknown) {
        super('BadRequest', message);
    }
}


export class WsUnauthorizedException extends WsTypesException {
    constructor(message: string | unknown) {
        super('Unauthorized', message);
    }
}

export class WsUnknownException extends WsTypesException {
    constructor(message: string | unknown) {
        super('Unknown', message);
    }
}