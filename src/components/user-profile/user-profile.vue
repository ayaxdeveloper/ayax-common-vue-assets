<template>
    <v-menu 
    offset-y
    open-on-hover 
    bottom>
        <v-btn
        slot="activator"
        flat 
        >
            <v-avatar
            class="mr-3"
            size="32"
            v-if="currentUser && currentUser.profilePictureUrl"
            >
            <img :src="currentUser.profilePictureUrl" alt="avatar">
            </v-avatar>
            {{currentUser && currentUser.name}}
            <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-list
        dark>
            <v-list-tile @click="logout()">
                <v-list-tile-action><v-icon>rowing</v-icon></v-list-tile-action>
                <v-list-tile-title>Выйти</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-menu>
</template>

<script lang="ts" src="./user-profile.ts">
</script>

<style>

</style>
