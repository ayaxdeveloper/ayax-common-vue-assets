import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { NotificationProvider } from '../../../src/providers/notification/notification-provider';
import { INotificationProvider, INotificationSettings, IAppSettings } from 'ayax-common-types';
import { SidebarComponentItem } from '../components/sidebar/sidebar-item';
import { AppSettings } from '../settings';
import { EventBus } from '../event-bus';

@Component
export default class App extends Vue {
    
    appSettings: IAppSettings = new AppSettings();
    notificationSettings:  INotificationSettings = this.appSettings.Notification();
    notificationProvider: INotificationProvider = new NotificationProvider(this.notificationSettings, EventBus); 

    castNotification(type: string) {
        switch(type){
            case 'success':{
                this.notificationProvider.Success('Успешно сохранено');
            }
            break;
            case 'error': {
                this.notificationProvider.Error();
            }
            break;
            case 'info':{
                this.notificationProvider.Info();
            }
            break;
            case 'warning':{
                this.notificationProvider.Warning();
            }
            break;
        }
    }

    sidebarItems: SidebarComponentItem[] = [
        new SidebarComponentItem({
            title: "CALL CENTER",
            icon: "contact_phone",
            href: "/",
            isSystem: true
        }),
        new SidebarComponentItem({title: "НОВЫЙ ЗВОНОК", icon: "add", route: "/lead/add"}),
        new SidebarComponentItem({title: "ЗВОНКИ", icon: "mdi-inbox", route: "/lead/list"}),
        new SidebarComponentItem({
            title: "НАСТРОЙКИ",
            icon: "build",
            subItems: [
                new SidebarComponentItem({title: "Вертушка", route: "/switcher/list"}),
                new SidebarComponentItem({title: "Маршруты", route: "/route/list"}),
                new SidebarComponentItem({title: "Источники", route: "/infosource/list"}),
                new SidebarComponentItem({title: "Темы обращений", route: "/leadtype/list"}),
                new SidebarComponentItem({title: "Типы объектов", route: "/objecttype/list"}),
                new SidebarComponentItem({title: "Номера операторов", route: "/operatornumber/list"}),
                new SidebarComponentItem({title: "Номера подразделений", route: "/divisionredirect"}),
                new SidebarComponentItem({title: "Параметры", route: "/preference/list"})
            ]
        })
    ];
}