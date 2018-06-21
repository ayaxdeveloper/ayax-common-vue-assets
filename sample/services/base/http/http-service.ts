import axios from 'axios';
import { AppSettings } from '../../../settings';
import { IHttpService } from 'ayax-common-types';

require('../../../mock-adapter');

export class HttpService implements IHttpService {
    baseUrl: string;
    private _serverSettings = new AppSettings().Server();
    constructor(apiUrl? :string) {
        this.baseUrl = apiUrl ? apiUrl : `${this._serverSettings.baseUrl}${this._serverSettings.apiPrefix}`;
    } 

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