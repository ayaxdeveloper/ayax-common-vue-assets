import { Vue, Provide } from 'vue-property-decorator';
import { AppSettings } from './settings';
import { IAppSettings, IServerSettings, IClientSettings, INotificationSettings, INotificationProvider, IHttpService } from 'ayax-common-types';
import { HttpService } from './services/base/http/http-service';
import { NotificationProvider } from '../src/index';
import { EventBus } from './event-bus';
import { StaticDictionary } from './static-dictionary';
import { ICacheService, CacheService } from 'ayax-common-cache';
import { IOperationService, OperationService } from 'ayax-common-operation';

export abstract class VueInjection extends Vue {
    @Provide() appSettings: IAppSettings = new AppSettings();
    @Provide() notificationSettings:  INotificationSettings = this.appSettings.Notification();
    @Provide() notificationProvider: INotificationProvider = new NotificationProvider(this.notificationSettings, EventBus);
    @Provide() httpService: IHttpService = new HttpService();
    @Provide() operationService: IOperationService = new OperationService(this.httpService);
    @Provide() clientSettings: IClientSettings = this.appSettings.Client();
    @Provide() serverSettings: IServerSettings = this.appSettings.Server();
    @Provide() cacheService: ICacheService = new CacheService(this.operationService, 15, StaticDictionary);
}