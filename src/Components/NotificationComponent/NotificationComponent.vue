<template>
    <div class="notification-block">
        <div class="notification-block__inner">
            <v-alert
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item"
                @click="notificationClick(notification)"
                color="white"
                :value="notification.showing"
                :outline="notification.outline"
                v-model="notification.showing"
                :dismissible="notification.dismissAfter == 0 || notification.dismissAfter > 5000"
                transition="fade"
                :style="{cursor: notification.onClick ? 'pointer' : ''}"
            >
                <v-layout
                    class="ml-2 mt-2"
                    :class="{'mb-2': notification.message == ''}"
                    row
                    align-start
                >
                    <v-icon class="mt-1" :color="notification.color">{{ notification.icon }}</v-icon>
                    <v-flex class="ml-2">
                        <div
                            v-if="notification.title != ''"
                            style="height: 30px; line-height: 30px"
                        >
                            <h3 :class="notification.color + '--text'">{{ notification.title }}</h3>
                        </div>
                        <div v-if="notification.message != ''" style="line-height: 30p;">
                            <p class="grey--text">{{ notification.message }}</p>
                        </div>
                    </v-flex>
                </v-layout>
            </v-alert>
        </div>
    </div>
</template>

<script lang="ts">
import { INotificationProvider, NotificationItem } from "ayax-common-types";
import { Component, Inject , Vue } from "vue-property-decorator";

@Component({
    name: "a-notification"
})
export default class NotificationComponent extends Vue {
    @Inject() notificationProvider: INotificationProvider;
    notifications: NotificationItem[] = this.notificationProvider.notifications;

    notificationClick(notification: NotificationItem) {
        if (notification.onClick) {
            notification.onClick(notification);
            if (notification.closeAfterClick) {
                notification.showing = false;
            }
        }
    }
}
</script>

<style scoped>
.notification-block {
    position: fixed;
    bottom: 50px;
    right: 15px;
    width: 330px;
    z-index: 999;
}
.notification-item,
.alert {
    border-width: 0;
    border: 1px solid black;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    -webkit-transition: opacity 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s, -webkit-transform 0.3s;
    transition: opacity 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s, -webkit-transform 0.3s;
    transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s;
    transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s, -webkit-transform 0.3s;
    overflow: hidden;
    padding: 0;
}

.fade-enter {
    right: 0;
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
}

.fade-leave-active {
    opacity: 0;
}
</style>
