import { Component, Vue , Inject, Prop} from 'vue-property-decorator';
import { INotificationProvider, NotificationItem } from 'ayax-common-types';
import { EventBus } from '../../event-bus';

@Component
export default class NotificationComponent extends Vue {
    @Prop() notificationProvider: INotificationProvider;
    notifications: NotificationItem[] = this.notificationProvider.notifications;
}