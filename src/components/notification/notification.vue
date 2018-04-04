<template>
<div class='notification-block'>
    <div class='notification-block__inner'>
        <v-alert v-for="notification in notifications" :key="notification.id" class="notification-item"
            :color="notification.color"
            :icon="notification.icon"
            :value="notification.showing"
            :outline="notification.outline"
            v-model="notification.showing"
            :dismissible ="notification.dismissAfter == 0 || notification.dismissAfter > 5000"
            transition="scale-transition">
            {{ notification.message }}
        </v-alert>
    </div>
</div>
</template>

<script lang="ts" src="./notification.ts">
    
</script>

<style scoped>
    .notification-block {
        position: fixed;
        bottom: 50px;
        right: 10px;
        width: 300px;
        z-index: 999;
    }
    .notification-item {
        opacity: 0.8; 
        padding: 10px 14px;
    }
</style>
