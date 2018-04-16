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

    breadcrumbsNames = {
        "": {name: "Главная", route: "home"},
        "switcher": {name: "Вертушка", route: "switcher-list"},
        "route": {name: "Маршруты", route: "route"},
        "contacttype": {name: "Типы контактов", route: "contacttype-list"},
        "config": {name: "Настройки" },
        "help": {name: "Помощь", route: "help" },
        "dictionary": {name: "Справочники"},
        "list": {name: "Список"},
        "board": {name: "Доска"},
        "edit": {name: "Редактирование"},
        "card": {name: "Карточка"}
    };

    sidebarItems: SidebarComponentItem[] = [
        new SidebarComponentItem({
            title: "Главная",
            icon: "contact_phone",
            href: "/",
            isSystem: true
        }),
        new SidebarComponentItem({title: "LIST", icon: "list", route: "/lead/add"}),
        new SidebarComponentItem({title: "EDIT", icon: "edit", route: "/lead/list"}),
        new SidebarComponentItem({title: "LIST-DIALOG", icon: "mdi-inbox", route: "/lead/list"}),
        new SidebarComponentItem({
            title: "НАСТРОЙКИ",
            icon: "build",
            subItems: [
                new SidebarComponentItem({title: "Вертушка", route: "/switcher/list"}),
                new SidebarComponentItem({title: "Маршруты", route: "/route"}),
                new SidebarComponentItem({title: "Источники", route: "/infosource"}),
                new SidebarComponentItem({title: "Темы обращений", route: "/leadtype"}),
                new SidebarComponentItem({title: "Типы объектов", route: "/objecttype"}),
                new SidebarComponentItem({title: "Номера операторов", route: "/operatornumber/list"}),
                new SidebarComponentItem({title: "Номера подразделений", route: "/divisionredirect"}),
                new SidebarComponentItem({title: "Параметры", route: "/preference"})
            ]
        })
    ];

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
}