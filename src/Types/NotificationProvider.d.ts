import Vue from "*.vue";
import { INotificationProvider, INotificationSettings, NotificationItem } from "ayax-common-types";
export declare class NotificationProvider implements INotificationProvider {
    notifications: NotificationItem[];
    private _settings;
    private _notificationBus;
    constructor(notificationSettings: INotificationSettings, notificationBus: Vue);
    Error(message?: any, title?: any, dismissAfter?: number): void;
    Success(message?: any, title?: any, dismissAfter?: number): void;
    Info(message?: any, title?: any, dismissAfter?: number): void;
    Warning(message?: any, title?: any, dismissAfter?: number): void;
    Debug(message?: any): void;
    GetNotifications(): any[];
    private GetErrorMessage;
    private PushNotification;
}
