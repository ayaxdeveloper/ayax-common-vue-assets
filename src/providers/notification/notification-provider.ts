import { INotificationProvider, NotificationItem, INotificationSettings } from 'ayax-common-types';
import Vue from '*.vue';

export class NotificationProvider implements INotificationProvider {
    notifications: NotificationItem[] = [];
    private _settings: INotificationSettings;
    private _notificationBus: Vue;
    constructor(notificationSettings: INotificationSettings, notificationBus: Vue) {
        this._settings = notificationSettings;
        this._notificationBus = notificationBus;
    }
    public Error(message?: any, title?: any, dismissAfter?: number) {
        this.PushNotification(new NotificationItem(
            message == null ? '' : message, 
            'warning', 
            'error', 
            title == null ? 'Ошибка' : title,
            dismissAfter != null ? dismissAfter : this._settings.errorDismiss
        ));
    }

    public Success(message?: any, title?: any, dismissAfter?: number) {
        this.PushNotification(new NotificationItem(
            message == null ? '' : message, 
            'check_circle', 
            'success', 
            title == null ? 'Успешно' : title,
            dismissAfter != null ? dismissAfter : this._settings.successDismiss
        ));
    }

    public Info(message?: any, title?: any, dismissAfter?: number) {
        this.PushNotification(new NotificationItem(
            message == null ? '' : message, 
            'info', 
            'info', 
            title == null ? 'Инфо' : title,
            dismissAfter != null ? dismissAfter : this._settings.infoDismiss
        ));
    }

    public Warning(message?: any, title?: any, dismissAfter?: number) {
        this.PushNotification(new NotificationItem(
            message == null ? '' : message, 
            'priority_high', 
            'warning', 
            title == null ? 'Предупреждение' : title,
            dismissAfter !=null ? dismissAfter : this._settings.warningDismiss
        ));
    }

    public Debug(message?: any) {
        console.log(message);
    }

    public GetNotifications() {
        return [];
    }

    private PushNotification(notification: NotificationItem) {
        this.notifications.push(notification); 
            if(notification.dismissAfter > 0 ) {
                setInterval(()=>{notification.showing = false}, notification.dismissAfter);
            }
    }
}
