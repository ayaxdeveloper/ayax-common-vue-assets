import { CacheService, ICacheService } from "ayax-common-cache";
import { IOperationService, OperationService } from "ayax-common-operation";
import { IAppSettings, IClientSettings, IHttpService, INotificationProvider, INotificationSettings, IServerSettings } from "ayax-common-types";
import { Provide, Vue } from "vue-property-decorator";
import { NotificationProvider } from "../src/index";
import { EVENTBUS } from "./event-bus";
import { HttpService } from "./services/base/http/http-service";
import { AppSettings } from "./settings";
import { STATICDICTIONARY } from "./static-dictionary";

export abstract class VueInjection extends Vue {
    @Provide() appSettings: IAppSettings = new AppSettings();
    @Provide() notificationSettings:  INotificationSettings = this.appSettings.Notification();
    @Provide() notificationProvider: INotificationProvider = new NotificationProvider(this.notificationSettings, EVENTBUS);
    @Provide() httpService: IHttpService = new HttpService();
    @Provide() operationService: IOperationService = new OperationService(this.httpService);
    @Provide() clientSettings: IClientSettings = this.appSettings.Client();
    @Provide() serverSettings: IServerSettings = this.appSettings.Server();
    @Provide() cacheService: ICacheService = new CacheService(this.operationService, 15, STATICDICTIONARY);
}