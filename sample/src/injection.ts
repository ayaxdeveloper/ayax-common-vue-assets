import { Vue, Provide } from 'vue-property-decorator';
import { AppSettings } from './settings';
import { IHttpService, IOperationService, IAppSettings, IServerSettings, IClientSettings, INotificationSettings, INotificationProvider } from 'ayax-common-types';
import { HttpService } from './services/base/http/http-service';
import { OperationService } from 'ayax-common-services';
import { EventBus } from './event-bus';
import { ISignarRService, SignalRService } from './services/signalr/signalr-service';
import { ICacheService, CacheService } from 'ayax-common-cache';
import { AuthService, IAuthService, SecurityService, ISecurityService } from 'ayax-common-auth';

export abstract class VueInjection extends Vue {
    @Provide() httpService: IHttpService = new HttpService();
    @Provide() authReaderService: IHttpService = new HttpService("https://auth.ayax.ru:8081/api");
    @Provide() authIdentityService: IHttpService = new HttpService("https://auth.ayax.ru/api");
    @Provide() operationService: IOperationService = new OperationService(this.httpService);
    @Provide() appSettings: IAppSettings = new AppSettings();
    @Provide() clientSettings: IClientSettings = this.appSettings.Client();
    @Provide() serverSettings: IServerSettings = this.appSettings.Server();
    @Provide() authService: IAuthService = new AuthService(this.authIdentityService, this.authReaderService);
    @Provide() signalRService: ISignarRService = new SignalRService(this.httpService);
    @Provide() securityService: ISecurityService = new SecurityService("accessrules");
}