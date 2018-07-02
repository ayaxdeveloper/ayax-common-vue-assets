import { AuthUser, IAuthService, ITokenService } from "ayax-common-auth";
import { Component, Inject, Prop, Vue } from "vue-property-decorator";

@Component
export default class UserProfileComponent extends Vue {
    @Inject() authService: IAuthService;
    @Inject() eventBus: Vue;
    @Inject() tokenService: ITokenService;
    @Prop({default: () => []}) modules: string[];
    currentUser: AuthUser = new AuthUser();
    async created() {
        this.currentUser = (await this.authService.GetAuthenticatedUser(this.modules));
    }

    logout() {
        this.eventBus.$emit("logout");
    }
}