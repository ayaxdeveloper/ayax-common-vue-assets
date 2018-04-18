import axios from 'axios';
import { EventBus } from '../../../event-bus';
import { IAppSettings } from 'ayax-common-types';
import { IHttpService } from 'ayax-common-services';
import { AppSettings } from '../../../settings';
import { TokenService } from '../../token/token-service';

require('../../../mock-adapter');

export class HttpService implements IHttpService {
    baseUrl: string;
    private _serverSettings = new AppSettings().Server();
    private _clientSettings = new AppSettings().Client();
    constructor(apiUrl? :string) {
        this.baseUrl = apiUrl ? apiUrl : `${this._serverSettings.baseUrl}${this._serverSettings.apiPrefix}`;
    }

    test = [
        { id: 1, code: '123', title: 'Alpha', created: new Date()}
    ];

    

    async post(relativeUrl: string, data: any) {
        return (await axios.post(`${this.baseUrl}${relativeUrl}`, data)).data;
    }

    async get(relativeUrl: String) {
        return (await axios.get(`${this.baseUrl}${relativeUrl}`)).data
    }

    async delete(relativeUrl: String) {
        return (await axios.delete(`${this.baseUrl}${relativeUrl}`)).data;
    }

    async put(relativeUrl: String, data: any) {
        return (await axios.put(`${this.baseUrl}${relativeUrl}`, data)).data;
    }
}