import { Component, Vue , Inject, Prop} from 'vue-property-decorator';
import { INotificationProvider, NotificationItem } from 'ayax-common-types';
import { EventBus } from '../../event-bus';

@Component
export default class NotificationComponent extends Vue {
    @Inject() notificationProvider: INotificationProvider;
    notifications: NotificationItem[] = [];
    created() {
        EventBus.$on('addNotification', (notification: NotificationItem) => {
            this.notifications.push(notification); 
            if(notification.dismissAfter > 0 ) {
                setInterval(()=>{notification.showing = false}, notification.dismissAfter);
            }
        });

    }
}