<template>
  <div id="app">
    <v-app>
      <a-sidebar :items="sidebarItems"></a-sidebar>
      <v-content>
        <a-notification :notificationProvider="notificationProvider"></a-notification>
        <v-toolbar dark light dense>
          <v-toolbar-title>Title</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn small color="success" @click="castNotification('success')">notification</v-btn>
              <v-btn small color="error" @click="castNotification('error')">notification</v-btn>
              <v-btn small color="info" @click="castNotification('info')">notification</v-btn>
              <v-btn small color="warning" @click="castNotification('warning')">notification</v-btn>
            </v-toolbar-items>
      </v-toolbar>
        <v-container fluid>
          <a-breadcrumbs :breadcrumbsNames="breadcrumbsNames"></a-breadcrumbs>
          <router-view></router-view>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script lang="ts" src="./App.ts">

</script>                            

<style>
</style>
