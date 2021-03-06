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
    public Error(message?: any, title?: any, dismissAfter?: number, onClick?: Function, closeAfterClick?: boolean) {
        this.PushNotification(
            new NotificationItem(
                this.GetErrorMessage(message),
                "mdi-alert",
                "error",
                title == null ? "Ошибка" : title,
                dismissAfter != null ? dismissAfter : this._settings.errorDismiss,
                (onClick = onClick),
                (closeAfterClick = closeAfterClick),
            ),
        );
        console.error(message);
    }

    public Success(message?: any, title?: any, dismissAfter?: number, onClick?: Function, closeAfterClick?: boolean) {
        this.PushNotification(
            new NotificationItem(
                this.GetErrorMessage(message),
                "mdi-checkbox-marked-circle",
                "success",
                title == null ? "Успешно" : title,
                dismissAfter != null ? dismissAfter : this._settings.successDismiss,
                (onClick = onClick),
                (closeAfterClick = closeAfterClick),
            ),
        );
    }

    public Info(message?: any, title?: any, dismissAfter?: number, onClick?: Function, closeAfterClick?: boolean) {
        this.PushNotification(
            new NotificationItem(
                this.GetErrorMessage(message),
                "mdi-information",
                "info",
                title == null ? "Инфо" : title,
                dismissAfter != null ? dismissAfter : this._settings.infoDismiss,
                (onClick = onClick),
                (closeAfterClick = closeAfterClick),
            ),
        );
    }

    public Warning(message?: any, title?: any, dismissAfter?: number, onClick?: Function, closeAfterClick?: boolean) {
        this.PushNotification(
            new NotificationItem(
                this.GetErrorMessage(message),
                "mdi-alert-circle",
                "warning",
                title == null ? "Предупреждение" : title,
                dismissAfter != null ? dismissAfter : this._settings.warningDismiss,
                (onClick = onClick),
                (closeAfterClick = closeAfterClick),
            ),
        );
    }

    public Debug(message?: any) {
        console.debug(message);
    }

    public GetNotifications() {
        return [];
    }

    private GetErrorMessage(message: any): string {
        if (message === null) {
            return "Неизвестная ошибка";
        }
        if (message.message) {
            return message.message;
        }
        if (message.systemMessage) {
            return message.systemMessage;
        }
        return `${message}`;
    }

    private PushNotification(notification: NotificationItem) {
        this.notifications.push(notification);
        if (notification.dismissAfter > 0) {
            setInterval(() => {
                notification.showing = false;
            }, notification.dismissAfter);
        }
    }
}
