import * as signalR from '@aspnet/signalr-client';
import { IHttpService, ServerSettings } from 'ayax-common-types';
import { AppSettings } from '../../settings';

export class SignalRService implements ISignarRService {
    private _connection: signalR.HubConnection;
    private _started: boolean;
    private _httpService: IHttpService;
    public connectionId: string;
    constructor(httpService: IHttpService, hubName?: string) {
        this._httpService = httpService;
        try {
            this._connection = new signalR.HubConnection(hubName ? hubName : 'signalNotifications');

            this.initConnection();

            this._connection.on('connect', (connectionId: string)=> {
                console.log(`SignalR client ${connectionId} connected`);
                this.connectionId = connectionId;
                this._httpService.get(`/authenticate?connectionId=${this.connectionId}`);                
            });

            this._connection.on('disconnect', ()=> {
                this.connectionId = null;
            });

        } catch (e) {
            console.warn("SignalR failed to connect");
            console.warn(e)
        }
    }

    private async initConnection() {
        await this._connection.start();
        this._started = true;
        console.log(`SignalR started`);
    }

    subscribe(method: string, callback: (...args: any[]) => void ) {
        this._connection.on(method, callback);
    }

    // getConnectionId(): string {
    //     if(this._started && this._connectionId) {
    //         return this._connectionId;
    //     } else {
    //         return this.getConnectionId();
    //     } 
    // }
}

export interface ISignarRService {
    subscribe(method: string, callback: (...args: any[]) => void );
    connectionId: string;
}