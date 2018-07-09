import Vue from "*.vue";
import { INotificationProvider, INotificationSettings, NotificationItem } from "ayax-common-types";

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
            message == null ? "" : message, 
            "mdi-alert", 
            "error", 
            title == null ? "Ошибка" : title,
            dismissAfter != null ? dismissAfter : this._settings.errorDismiss
        ));
        if (message) {
            console.error(`Error: ${message}`);
        }
        if (message && message.stack) {
            console.error(`Stack: ${message.stack}`);
        }
    }

    public Success(message?: any, title?: any, dismissAfter?: number) {
        this.PushNotification(new NotificationItem(
            message == null ? "" : message, 
            "mdi-checkbox-marked-circle", 
            "success", 
            title == null ? "Успешно" : title,
            dismissAfter != null ? dismissAfter : this._settings.successDismiss
        ));
    }

    public Info(message?: any, title?: any, dismissAfter?: number) {
        this.PushNotification(new NotificationItem(
            message == null ? "" : message, 
            "mdi-information", 
            "info", 
            title == null ? "Инфо" : title,
            dismissAfter != null ? dismissAfter : this._settings.infoDismiss
        ));
    }

    public Warning(message?: any, title?: any, dismissAfter?: number) {
        this.PushNotification(new NotificationItem(
            message == null ? "" : message, 
            "mdi-alert-circle", 
            "warning", 
            title == null ? "Предупреждение" : title,
            dismissAfter != null ? dismissAfter : this._settings.warningDismiss
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
            if (notification.dismissAfter > 0 ) {
                setInterval(() => {notification.showing = false;}, notification.dismissAfter);
            }
    }
}
