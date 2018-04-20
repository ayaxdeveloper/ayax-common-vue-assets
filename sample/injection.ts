import { Vue, Provide } from 'vue-property-decorator';
import { AppSettings } from './settings';
import { IAppSettings, IServerSettings, IClientSettings, INotificationSettings, INotificationProvider } from 'ayax-common-types';
import { IHttpService, IOperationService } from 'ayax-common-services';
import { HttpService } from './services/base/http/http-service';
import { OperationService } from 'ayax-common-services';
import { NotificationProvider } from '../src/index';
import { EventBus } from './event-bus';
import { StaticDictionary } from './static-dictionary';
import { ICacheService, CacheService } from 'ayax-common-cache';

export abstract class VueInjection extends Vue {
    @Provide() httpService: IHttpService = new HttpService();
    @Provide() operationService: IOperationService = new OperationService(this.httpService);
    @Provide() appSettings: IAppSettings = new AppSettings();
    @Provide() clientSettings: IClientSettings = this.appSettings.Client();
    @Provide() serverSettings: IServerSettings = this.appSettings.Server();
    @Provide() notificationSettings:  INotificationSettings = this.appSettings.Notification();
    @Provide() notificationProvider: INotificationProvider = new NotificationProvider(this.notificationSettings, EventBus);
    @Provide() cacheService: ICacheService = new CacheService(this.operationService, 15, StaticDictionary);
}