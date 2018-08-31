import { AuthService, IAuthService, ITokenService, TokenService } from "ayax-common-auth";
import { CacheService, ICacheService } from "ayax-common-cache";
import { IOperationService, OperationService } from "ayax-common-operation";
import { IAppSettings, IClientSettings, IHttpService, INotificationProvider, INotificationSettings, IServerSettings } from "ayax-common-types";
import { Provide, Vue } from "vue-property-decorator";
import { NotificationProvider } from "../src/Providers/NotificationProvider/NotificationProvider";
import { EVENTBUS } from "./EventBus";
import { HttpService } from "./Services/BaseService/HttpService/HttpService";
import { AppSettings } from "./Settings";
import { STATICDICTIONARY } from "./StaticDictionary";

export abstract class VueInjection extends Vue {
    @Provide() appSettings: IAppSettings = new AppSettings();
    @Provide() authReaderService: IOperationService = new OperationService(new HttpService("https://auth.ayax.ru:8081/api"));
    @Provide() authIdentityService: IOperationService = new OperationService(new HttpService("https://auth.ayax.ru/api"));
    @Provide() tokenService: ITokenService = new TokenService();
    @Provide() authService: IAuthService = new AuthService({
        identityOperation: this.authIdentityService,
        readerOperation: this.authReaderService,
        token: this.tokenService.getToken()
    });
    @Provide() notificationSettings:  INotificationSettings = this.appSettings.Notification();
    @Provide() notificationProvider: INotificationProvider = new NotificationProvider(this.notificationSettings, EVENTBUS);
    @Provide() httpService: IHttpService = new HttpService();
    @Provide() operationService: IOperationService = new OperationService(this.httpService);
    @Provide() clientSettings: IClientSettings = this.appSettings.Client();
    @Provide() serverSettings: IServerSettings = this.appSettings.Server();
    @Provide() cacheService: ICacheService = new CacheService(this.operationService, 15, STATICDICTIONARY);
}