<template>
  <v-menu offset-y bottom>
    <v-btn slot="activator" flat>
      <v-avatar
        class="mr-3"
        size="32"
        v-if="currentUser && currentUser.profilePictureUrl && showAvatar"
      >
        <img :src="currentUser.profilePictureUrl" alt="avatar">
      </v-avatar>
      {{currentUser && currentUser.name}}
      <v-icon>mdi-menu-down</v-icon>
    </v-btn>
    <v-list dark>
      <v-list-tile @click="logout()">
        <v-list-tile-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Выйти</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { AuthUser, IAuthService, ITokenService } from "ayax-common-auth";
import { Component, Inject, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "a-user-profile"
})
export default class UserProfileComponent extends Vue {
  @Inject() authService: IAuthService;
  @Inject() eventBus: Vue;
  @Inject() tokenService: ITokenService;
  @Prop({ default: null }) modules?: string[];
  @Prop({ default: true }) showAvatar: boolean;
  currentUser: AuthUser = new AuthUser();
  async created() {
    this.currentUser = await this.authService.GetCurrentUser();
  }

  logout() {
    this.eventBus.$emit("logout");
  }
}
</script>
