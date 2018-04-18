import axios from 'axios';
import { EventBus } from '../../../event-bus';
import { IHttpService, IAppSettings } from 'ayax-common-types';
import { AppSettings } from '../../../settings';
import { TokenService } from '../../token/token-service';

export class HttpService implements IHttpService {
    baseUrl: string;
    private _serverSettings = new AppSettings().Server();
    private _clientSettings = new AppSettings().Client();
    constructor(apiUrl? :string) {
        this.baseUrl = apiUrl ? apiUrl : `${this._serverSettings.baseUrl}${this._serverSettings.apiPrefix}`;

        axios.interceptors.request.use(request => {
            let token = TokenService.getToken();
            if(token) {
                request.headers.Authorization = token;
            }
            return request
        });

        axios.interceptors.response.use(response => {
            let token = response.headers['Authorization'];
            if(!token) {
                token = TokenService.getTokenFromCookie("token", document.cookie);
            }
            token && TokenService.setToken(token);
            return response;
        }, error => {
            if (error.response && (error.response.status === 400 || error.response.status === 401)) {
                if (!(error.config.method === 'post' && /\/api\/authenticate\/?$/.test(error.config.url))) {
                    EventBus.$emit('logout');
                }
            } else {
                console.warn(error);
            }

            return Promise.reject(error);
        });
    }

    

    

    post(relativeUrl: string, data: any) {
        return axios.post(`${this.baseUrl}${relativeUrl}`, data);
    }

    get(relativeUrl: String) {
        return axios.get(`${this.baseUrl}${relativeUrl}`);
    }

    delete(relativeUrl: String) {
        return axios.delete(`${this.baseUrl}${relativeUrl}`);
    }

    put(relativeUrl: String, data: any) {
        return axios.put(`${this.baseUrl}${relativeUrl}`, data);
    }
}