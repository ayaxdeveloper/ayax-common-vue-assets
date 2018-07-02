import { INotificationProvider, NotificationItem } from "ayax-common-types";
import { Component, Inject , Vue } from "vue-property-decorator";

@Component
export default class NotificationComponent extends Vue {
    @Inject() notificationProvider: INotificationProvider;
    notifications: NotificationItem[] = this.notificationProvider.notifications;
}